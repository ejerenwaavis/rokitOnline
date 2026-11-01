const rateLimit = require('express-rate-limit');

const publicFormRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP. Please wait a few minutes and try again.',
  },
});

function hasRandomCamelCaseGibberish(str = '') {
  const text = String(str || '').trim();
  if (!text) return false;
  // Single token of 12+ letters with no spaces and multiple random case flips (e.g. "tVaonnVGZTJiHCTfoH")
  if (/^[A-Za-z]{12,}$/.test(text)) {
    const transitions = (text.match(/[a-z][A-Z]|[A-Z]{2,}[a-z]/g) || []).length;
    if (transitions >= 2) return true;
  }
  return false;
}

/**
 * Heuristic check for botnet accounts / spam payloads.
 * Specifically catches the botnet pattern:
 * - Random consonant-cluster names (e.g. "Zelotpaw Nklzhbp", "Yadaz Lgxmjbvbd", "Bhohcy Otyfw")
 * - Dotted-Gmail generator addresses (e.g. "u.mi.zuyek.u.j.o0.31@gmail.com", "mowid.ufo.6.9@gmail.com")
 * - Single-word random mixed-case descriptions/subjects (e.g. "tVaonnVGZTJiHCTfoH", "HiSDzimwbndXhIAwH")
 * - Purely numeric message bodies (e.g. "3293766952")
 */
function isSuspectedBotPayload({ name = '', email = '', phone = '', subject = '', message = '' } = {}) {
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPhone = String(phone || '').trim();
  const cleanSubject = String(subject || '').trim();
  const cleanMsg = String(message || '').trim();

  // 1. Dotted Gmail bot pattern (3 or more dots before @gmail.com / @googlemail.com)
  if (cleanEmail.endsWith('@gmail.com') || cleanEmail.endsWith('@googlemail.com')) {
    const localPart = cleanEmail.split('@')[0] || '';
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount >= 3) {
      return { isBot: true, reason: 'Suspicious dotted email pattern detected' };
    }
  }

  // 2. Gibberish / consonant-cluster name detection
  if (cleanName) {
    if (/[bcdfghjklmnpqrstvwxz]{4,}/i.test(cleanName)) {
      return { isBot: true, reason: 'Automated gibberish name pattern detected' };
    }

    const words = cleanName.split(/\s+/).filter(Boolean);
    for (const word of words) {
      const lettersOnly = word.replace(/[^a-z]/gi, '');
      if (lettersOnly.length >= 4 && !/[aeiouy]/i.test(lettersOnly)) {
        return { isBot: true, reason: 'Automated non-vocalic name pattern detected' };
      }
      if (lettersOnly.length >= 6) {
        const vowels = (lettersOnly.match(/[aeiouy]/gi) || []).length;
        if (vowels / lettersOnly.length < 0.2) {
          return { isBot: true, reason: 'Automated low-vowel name pattern detected' };
        }
      }
    }
  }

  // 3. Random mixed-case single-token subject or message/description (e.g. "tVaonnVGZTJiHCTfoH")
  if (hasRandomCamelCaseGibberish(cleanSubject) || hasRandomCamelCaseGibberish(cleanMsg)) {
    return { isBot: true, reason: 'Automated random token content detected' };
  }

  // 4. Purely numeric message body (e.g. "3293766952")
  if (cleanMsg && /^\d{6,15}$/.test(cleanMsg)) {
    return { isBot: true, reason: 'Automated numeric spam body detected' };
  }

  // 5. Consonant cluster inside message or subject
  if (
    /[bcdfghjklmnpqrstvwxz]{6,}/i.test(cleanMsg) ||
    /[bcdfghjklmnpqrstvwxz]{6,}/i.test(cleanSubject)
  ) {
    return { isBot: true, reason: 'Automated gibberish content detected' };
  }

  return { isBot: false, reason: null };
}

function antiBotGuard(req, res, next) {
  const body = req.body || {};

  // 1. Honeypot trap fields (invisible to real users, filled by bots)
  const honeypotFields = ['website', 'company_url', '_gotcha', 'fax'];
  for (const field of honeypotFields) {
    if (body[field] && String(body[field]).trim().length > 0) {
      return res.status(400).json({ message: 'Submission rejected by spam filter.' });
    }
  }

  // 2. Form timing check (if _formLoadedAt is supplied by client)
  if (body._formLoadedAt) {
    const loadedAt = Number(body._formLoadedAt);
    const elapsed = Date.now() - loadedAt;
    if (!Number.isNaN(loadedAt) && elapsed > 0 && elapsed < 1200) {
      return res.status(400).json({ message: 'Submission was too fast. Please try again.' });
    }
  }

  // 3. Content & identity heuristic check
  const check = isSuspectedBotPayload({
    name: body.name,
    email: body.email,
    phone: body.phone,
    subject: body.subject,
    message: body.message || body.projectDescription || body.description || body.brief || '',
  });

  if (check.isBot) {
    return res.status(400).json({
      message:
        'Your submission was flagged by our automated spam protection. Please check your details and try again.',
    });
  }

  next();
}

module.exports = {
  publicFormRateLimiter,
  antiBotGuard,
  isSuspectedBotPayload,
};
