'use strict';
/**
 * Blog Post Generator — Clonable System 03
 *
 * Usage:
 *   node index.js --topic "The Future of AI Agents"
 *   node index.js --topic "The Future of AI Agents" --output my-blog.md
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Blackboard } = require('./src/core/Blackboard');
const { DAGRunner } = require('./src/core/DAGRunner');
const { PlannerAgent } = require('./src/agents/PlannerAgent');
const { ResearcherAgent } = require('./src/agents/ResearcherAgent');
const { WriterAgent } = require('./src/agents/WriterAgent');
const { Observability } = require('./src/core/Observability');

async function main() {
  // Parse command-line arguments
  const topicIdx = process.argv.indexOf('--topic');
  const topic = topicIdx !== -1 ? process.argv[topicIdx + 1] : 'The Rise of Multi-Agent Systems in 2026';

  const outputIdx = process.argv.indexOf('--output');
  const outputFile = outputIdx !== -1
    ? process.argv[outputIdx + 1]
    : `blog-post-${topic.replace(/\s+/g, '-').toLowerCase()}.md`;

  console.log('\n' + '━'.repeat(60));
  console.log(' Blog Post Generator (3-Agent DAG)');
  console.log('━'.repeat(60));
  console.log(`Topic:  ${topic}`);
  console.log(`Output: ${outputFile}\n`);

  const obs = new Observability(topic);
  const blackboard = new Blackboard(topic);
  blackboard.setArtifact('observability', obs);

  // Instantiate agents
  const planner = new PlannerAgent();
  const researcher = new ResearcherAgent();
  const writer = new WriterAgent();

  // Set up dependency graph
  const runner = new DAGRunner();
  runner.addNode('Planner', planner);
  runner.addNode('Researcher', researcher, ['Planner']);
  runner.addNode('Writer', writer, ['Researcher']);

  const startTime = Date.now();

  try {
    // Run DAG pipeline
    await runner.run(blackboard);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const summary = blackboard.summary();

    // Write final blog post to file
    const output = blackboard.artifacts.blog_post || 'No blog post was generated.';
    fs.writeFileSync(outputFile, output, 'utf-8');

    // Summary
    console.log('\n' + '━'.repeat(60));
    console.log(' Content Generation Complete');
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
      console.log(`\n[budget] Generation stopped: ${err.message}`);
    } else {
      console.log(`\n[error] Generation failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    }
  }
}

main();
