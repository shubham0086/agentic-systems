'use strict';
/**
 * Research Agent — Clonable System 01
 *
 * Usage:
 *   node index.js --topic "multi-agent systems"
 *   node index.js --topic "climate change" --output my-research.md
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Blackboard } = require('./src/core/Blackboard');
const { ResearcherAgent } = require('./src/agents/ResearcherAgent');
const { Observability } = require('./src/core/Observability');

async function main() {
  // Parse command-line arguments
  const topicIdx = process.argv.indexOf('--topic');
  const topic = topicIdx !== -1 ? process.argv[topicIdx + 1] : 'machine learning in 2026';

  const outputIdx = process.argv.indexOf('--output');
  const outputFile = outputIdx !== -1
    ? process.argv[outputIdx + 1]
    : `research-${topic.replace(/\s+/g, '-').toLowerCase()}.md`;

  console.log('\n' + '━'.repeat(60));
  console.log(' Research Agent');
  console.log('━'.repeat(60));
  console.log(`Topic: ${topic}`);
  console.log(`Output: ${outputFile}\n`);

  const obs = new Observability(topic);
  const blackboard = new Blackboard(topic);
  blackboard.setArtifact('observability', obs);

  const researcher = new ResearcherAgent();
  const startTime = Date.now();

  try {
    // Execute research
    await researcher.execute(blackboard);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const summary = blackboard.summary();

    // Write output file
    const output = blackboard.artifacts.research_output || 'No research produced.';
    fs.writeFileSync(outputFile, output, 'utf-8');

    // Summary
    console.log('━'.repeat(60));
    console.log(' Research Complete');
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
      console.log(`\n[budget] Research stopped: ${err.message}`);
    } else {
      console.log(`\n[error] Research failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    }
  }
}

main();
