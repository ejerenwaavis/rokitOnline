import fs from 'fs';
import path from 'path';
import { parseProjectPortfolioRegister } from '../services/markdownParser.js';

// Load test file
const filePath = path.resolve(process.cwd(), 'rOKIt_Project_Portfolio_Upload_Register_2026-10-13.md');

if (!fs.existsSync(filePath)) {
  console.error('Test markdown file not found at:', filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');
const results = parseProjectPortfolioRegister(content);

console.log('--- TEST RESULTS ---');
console.log(`Total projects parsed: ${results.length} (Expected: 32)`);

// Assertions
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

const prj32 = results.find(p => p.projectCode === 'PRJ-032');
assert(Boolean(prj32), 'PRJ-032 found');
assert(prj32.title.includes('Multilingual Event Publications'), 'PRJ-032 title match');

console.log('\nAll parser assertions passed successfully.');
