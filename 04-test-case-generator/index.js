'use strict';
/**
 * Test Case Generator — Clonable System 04
 *
 * Usage:
 *   node index.js --file src/utils/math.js --function calculateCompoundInterest
 *   node index.js --file src/utils/math.js --function calculateCompoundInterest --output calculateCompoundInterest.test.js
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Blackboard } = require('./src/core/Blackboard');
const { TestGeneratorAgent } = require('./src/agents/TestGeneratorAgent');
const { Observability } = require('./src/core/Observability');

async function main() {
  // Parse command line arguments
  const fileIdx = process.argv.indexOf('--file');
  if (fileIdx === -1 || !process.argv[fileIdx + 1]) {
    console.error('[Error] Please specify the source code file using --file <filepath>');
    process.exit(1);
  }
  const filePath = process.argv[fileIdx + 1];

  const funcIdx = process.argv.indexOf('--function');
  if (funcIdx === -1 || !process.argv[funcIdx + 1]) {
    console.error('[Error] Please specify the function name to test using --function <name>');
    process.exit(1);
  }
  const functionName = process.argv[funcIdx + 1];

  if (!fs.existsSync(filePath)) {
    console.error(`[Error] File not found: ${filePath}`);
    process.exit(1);
  }

  const outputIdx = process.argv.indexOf('--output');
  const outputFile = outputIdx !== -1
    ? process.argv[outputIdx + 1]
    : `tests/${functionName}.test.js`;

  console.log('\n' + '━'.repeat(60));
  console.log(' Test Case Generator System');
  console.log('━'.repeat(60));
  console.log(`Source File: ${filePath}`);
  console.log(`Function:    ${functionName}`);
  console.log(`Output:      ${outputFile}\n`);

  const codeContent = fs.readFileSync(filePath, 'utf-8');

  // Set up Observability & Blackboard
  const goalStr = `Generate unit tests for "${functionName}" in ${filePath}`;
  const obs = new Observability(goalStr);
  const blackboard = new Blackboard(goalStr);
  blackboard.setArtifact('observability', obs);
  blackboard.setArtifact('code_content', codeContent);
  blackboard.setArtifact('function_name', functionName);

  // Set up Agent
  const generator = new TestGeneratorAgent();

  const startTime = Date.now();

  try {
    // Run unit test generation
    await generator.execute(blackboard);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const summary = blackboard.summary();

    // Ensure target folder exists
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write final output unit test file
    const output = blackboard.artifacts.test_code || '// No test suite generated.';
    fs.writeFileSync(outputFile, output, 'utf-8');

    // Summary
    console.log('━'.repeat(60));
    console.log(' Test Case Generation Complete');
    console.log('━'.repeat(60));
    console.log(`Time:  ${elapsed}s`);
    console.log(`Cost:  ${summary.totalCost}`);
    console.log(`Notes: ${summary.notesCount} entries`);
    console.log(`Output written to: ${path.resolve(outputFile)}`);
    console.log('━'.repeat(60) + '\n');

    obs.saveTrace();

  } catch (err) {
    obs.saveTrace();
    if (err.message.includes('Budget exceeded')) {
      console.log(`\n[budget] Test generation stopped: ${err.message}`);
    } else {
      console.log(`\n[error] Test generation failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    }
  }
}

main();
