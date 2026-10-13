import { parseProjectPortfolioRegister } from '../services/markdownParser.js';

const sampleMarkdown = `
# Rokit Project Portfolio Register
Confidential internal document.

## Project records

### PRJ-001 — AfriTeach Institute
**Description:** Pan-African educational publishing and digital identity systems. Category: Flagship.
**Flow / milestones:** Identity system -> Curriculum templates -> Graduation print packs
**Suggested upload image titles:** ["AfriTeach Institute — cover / hero", "AfriTeach Institute — curriculum breakdown", "AfriTeach Institute — student handbook", "AfriTeach Institute — graduation ceremony"]
**Evidence:** Completed print run archives | **Public clearance:** Approved
**Next action:** Upload photo hero

${Array.from({ length: 30 }, (_, i) => {
  const num = String(i + 2).padStart(3, '0');
  return `### PRJ-${num} — Project Sample ${num}
**Description:** Sample project description. Category: Commercial.
**Flow / milestones:** Phase 1 -> Phase 2
**Suggested upload image titles:** ["Project Sample ${num} — hero shot", "Project Sample ${num} — detail view"]
**Evidence:** Client delivery note | **Public clearance:** Approved
**Next action:** Queue media upload`;
}).join('\n\n')}

### PRJ-032 — Multilingual Event Publications
**Description:** High-volume event print publishing across French, English, and Portuguese delegates. Category: Editorial.
**Flow / milestones:** Delegate booklets -> Stage badging -> Live distribution
**Suggested upload image titles:** ["Multilingual Event Publications — cover booklet", "Multilingual Event Publications — delegate badges"]
**Evidence:** Print verification sheets | **Public clearance:** Approved
**Next action:** Ingest media assets

## Footer notes
End of records.
`;

const results = parseProjectPortfolioRegister(sampleMarkdown);

console.log('--- UNIT TEST RESULTS ---');
console.log(`Total projects parsed: ${results.length} (Expected: 32)`);

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
};

assert(results.length === 32, 'Parsed exact count of 32 project records');

const prj1 = results.find(p => p.projectCode === 'PRJ-001');
assert(Boolean(prj1), 'PRJ-001 found');
assert(prj1.title === 'AfriTeach Institute', 'PRJ-001 title match');
assert(prj1.category === 'Flagship', 'PRJ-001 category extracted');
assert(prj1.milestones.length === 4, 'PRJ-001 has 4 auto-instantiated milestones');
assert(prj1.milestones[0].title.toLowerCase().includes('cover'), 'PRJ-001 first milestone title cleaned');
assert(prj1.slug === 'prj-001-afriteach-institute', 'PRJ-001 slug format');

const prj32 = results.find(p => p.projectCode === 'PRJ-032');
assert(Boolean(prj32), 'PRJ-032 found');
assert(prj32.title.includes('Multilingual Event Publications'), 'PRJ-032 title match');

console.log('\nAll unit test assertions passed successfully!');
