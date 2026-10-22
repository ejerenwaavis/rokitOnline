const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SECRETS_DIR = path.join(__dirname, '../../secrets');
const JWKS_PATH = path.join(SECRETS_DIR, 'jwks.json');

function getOrGenerateJWKS() {
  // 1. Env override if provided
  if (process.env.ROKIT_OIDC_JWKS) {
    try {
      const parsed = JSON.parse(process.env.ROKIT_OIDC_JWKS);
      if (parsed && Array.isArray(parsed.keys)) {
        return parsed;
      }
    } catch (err) {
      console.warn('[OIDC KEYSTORE] Invalid ROKIT_OIDC_JWKS in env, falling back to disk:', err.message);
    }
  }

  // 2. Read from disk if exists
  if (fs.existsSync(JWKS_PATH)) {
    try {
      const content = fs.readFileSync(JWKS_PATH, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.keys) && parsed.keys.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn('[OIDC KEYSTORE] Error reading jwks.json, regenerating:', err.message);
    }
  }

  // 3. Generate new RS256 Keypair
  if (!fs.existsSync(SECRETS_DIR)) {
    fs.mkdirSync(SECRETS_DIR, { recursive: true });
  }

  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  const jwk = privateKey.export({ format: 'jwk' });
  jwk.kid = `rokit-sig-${Date.now().toString(36)}`;
  jwk.use = 'sig';
  jwk.alg = 'RS256';

  const keystore = { keys: [jwk] };
  fs.writeFileSync(JWKS_PATH, JSON.stringify(keystore, null, 2), { mode: 0o600 });
  console.log(`[OIDC KEYSTORE] Generated new RS256 signing key with kid "${jwk.kid}" at ${JWKS_PATH}`);

  return keystore;
}

module.exports = { getOrGenerateJWKS, JWKS_PATH };
