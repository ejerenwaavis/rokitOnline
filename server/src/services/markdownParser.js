/**
 * Markdown Parsing Service for Project Portfolio Register
 * Standardized for rOKIt_Project_Portfolio_Upload_Register_2026-10-13.md
 */

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function escapeRegex(str) {
  return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parses markdown register content into structured project records
 * @param {string} markdownContent
 * @returns {Array<Object>} parsed projects
 */
function parseProjectPortfolioRegister(markdownContent) {
  if (!markdownContent || typeof markdownContent !== 'string') {
    return [];
  }

  // 1. Target Section: Extract content strictly within `## Project records`
  const sectionRegex = /##\s+Project records\b([\s\S]*?)(?=(?:\n##\s+[^\n]+|$))/i;
  const sectionMatch = markdownContent.match(sectionRegex);
  const sectionContent = sectionMatch ? sectionMatch[1] : markdownContent;

  // 2. Block Splitting: Split records on `(?:^|\n)###\s+`
  const rawBlocks = sectionContent.split(/(?:^|\n)###\s+/).filter((block) => block.trim().length > 0);

  const projects = [];

  for (const block of rawBlocks) {
    const lines = block.split('\n');
    const headerLine = (lines[0] || '').trim();
    const bodyText = lines.slice(1).join('\n');

    // 3. Header Extraction: Match `^(PRJ-\d+)\s*[—–-]\s*(.+)$`
    const headerMatch = headerLine.match(/^(PRJ-\d+)\s*[—–-]\s*(.+)$/i);
    if (!headerMatch) {
      continue;
    }

    const projectCode = headerMatch[1].trim().toUpperCase();
    const title = headerMatch[2].trim();
    const slugifiedTitle = slugify(title);
    const slug = `${projectCode.toLowerCase()}-${slugifiedTitle}`;

    // 4. Field Extractions via Regex:

    // Description & Category:
    let description = '';
    let category = 'General';
    const descMatch = bodyText.match(/\*\*Description:\*\*\s*([\s\S]*?)(?=\*\*[-A-Za-z0-9\s/—–]+:\*\*|$)/i);
    if (descMatch) {
      description = descMatch[1].trim();
      const catMatch = description.match(/Category:\s*([^.\n]+)/i);
      if (catMatch) {
        category = catMatch[1].trim();
      }
    }

    // Flow / milestones:
    let flowNotes = '';
    const flowMatch = bodyText.match(/\*\*Flow\s*\/\s*milestones:\*\*\s*([\s\S]*?)(?=\*\*[-A-Za-z0-9\s/—–]+:\*\*|$)/i);
    if (flowMatch) {
      flowNotes = flowMatch[1].trim();
    }

    // Suggested upload image titles:
    let suggestedTitles = [];
    const titlesMatch = bodyText.match(/\*\*Suggested upload image titles:\*\*\s*([\s\S]*?)(?=\*\*[-A-Za-z0-9\s/—–]+:\*\*|$)/i);
    if (titlesMatch) {
      const jsonArrayMatch = titlesMatch[1].match(/\[[\s\S]*?\]/);
      if (jsonArrayMatch) {
        try {
          suggestedTitles = JSON.parse(jsonArrayMatch[0]);
        } catch {
          try {
            const sanitized = jsonArrayMatch[0].replace(/'/g, '"');
            suggestedTitles = JSON.parse(sanitized);
          } catch {
            const matches = [...jsonArrayMatch[0].matchAll(/"([^"]+)"|'([^']+)'/g)];
            suggestedTitles = matches.map((m) => m[1] || m[2]);
          }
        }
      }
    }

    // Evidence:
    let evidence = '';
    const evidenceMatch = bodyText.match(/\*\*Evidence:\*\*\s*([\s\S]*?)(?=\s*\|\s*\*\*Public clearance:\*\*|\n\*\*|\n\n|$)/i);
    if (evidenceMatch) {
      evidence = evidenceMatch[1].trim();
    }

    // Public clearance:
    let publicClearance = 'Pending';
    const clearanceMatch = bodyText.match(/\*\*Public clearance:\*\*\s*([^|\n\r]+)/i);
    if (clearanceMatch) {
      publicClearance = clearanceMatch[1].trim();
    }

    // Next action:
    let nextAction = '';
    const nextActionMatch = bodyText.match(/\*\*Next action:\*\*\s*([\s\S]*?)(?=\*\*[-A-Za-z0-9\s/—–]+:\*\*|$)/i);
    if (nextActionMatch) {
      nextAction = nextActionMatch[1].trim();
    }

    // 5. Milestone Auto-Instantiation:
    const milestones = (suggestedTitles || []).map((rawTitle, index) => {
      let cleanTitle = String(rawTitle).trim();

      // Strip project title or code prefix (e.g. "AfriTeach Institute — cover / hero" -> "cover / hero")
      const prefixRegex = new RegExp(`^(?:${escapeRegex(title)}|${escapeRegex(projectCode)})\\s*[-—–:]\\s*`, 'i');
      cleanTitle = cleanTitle.replace(prefixRegex, '').trim();

      // Capitalize first character
      if (cleanTitle.length > 0) {
        cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      }

      const milestoneId = slugify(cleanTitle) || `milestone-${index + 1}`;

      return {
        id: milestoneId,
        title: cleanTitle,
        description: String(rawTitle).trim(), // the raw suggested title
        order: index,
        media: [],
      };
    });

    projects.push({
      projectCode,
      title,
      slug,
      category,
      description,
      evidence,
      publicClearance,
      nextAction,
      flowNotes,
      milestones,
      mediaCount: 0,
      status: 'pending_media',
    });
  }

  return projects;
}

module.exports = {
  parseProjectPortfolioRegister,
  slugify,
  escapeRegex,
};
