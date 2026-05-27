'use strict';
/**
 * Bug Triage System — Clonable System 05
 *
 * Usage:
 *   node index.js --issue "The database connections are dropping under load"
 *   node index.js --issue "Typos in login screen copy" --output triage-result.json
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Blackboard } = require('./src/core/Blackboard');
const { DAGRunner } = require('./src/core/DAGRunner');
const { ClassifierAgent } = require('./src/agents/ClassifierAgent');
const { RouterAgent } = require('./src/agents/RouterAgent');
const { Observability } = require('./src/core/Observability');

async function main() {
  // Parse command line arguments
  const issueIdx = process.argv.indexOf('--issue');
  if (issueIdx === -1 || !process.argv[issueIdx + 1]) {
    console.error('[Error] Please specify the issue details using --issue "<description>"');
    process.exit(1);
  }
  const issueText = process.argv[issueIdx + 1];

  const outputIdx = process.argv.indexOf('--output');
  const outputFile = outputIdx !== -1 ? process.argv[outputIdx + 1] : null;

  console.log('\n' + '━'.repeat(60));
  console.log(' Bug Triage & Ticket Routing System (DAG)');
  console.log('━'.repeat(60));
  console.log(`Issue: ${issueText.substring(0, 50)}${issueText.length > 50 ? '...' : ''}`);
  if (outputFile) console.log(`Output: ${outputFile}`);
  console.log();

  // Set up Blackboard & Observability
  const obs = new Observability(issueText);
  const blackboard = new Blackboard(issueText);
  blackboard.setArtifact('observability', obs);

  // Set up agents
  const classifier = new ClassifierAgent();
  const router = new RouterAgent();

  // Set up pipeline
  const runner = new DAGRunner();
  runner.addNode('Classifier', classifier);
  runner.addNode('Router', router, ['Classifier']);

  const startTime = Date.now();

  try {
    // Run bug triage DAG
    await runner.run(blackboard);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const summary = blackboard.summary();

    // Compile triage findings
    const classification = blackboard.artifacts.classification || {};
    const routing = blackboard.artifacts.routing || {};

    const triageReport = {
      issue: issueText,
      triage_details: {
        severity: classification.severity,
        component: classification.component,
        confidence_pct: classification.confidence,
      },
      routing_recommendation: {
        assigned_team: routing.suggested_team,
        reasoning: routing.reasoning,
        suggested_action: routing.next_action,
      },
      metadata: {
        time_elapsed_seconds: parseFloat(elapsed),
        estimated_cost: summary.totalCost,
      }
    };

    const formattedReport = JSON.stringify(triageReport, null, 2);

    if (outputFile) {
      fs.writeFileSync(outputFile, formattedReport, 'utf-8');
      console.log('\n' + '━'.repeat(60));
      console.log(' Triage Complete');
      console.log('━'.repeat(60));
      console.log(`Output written to: ${path.resolve(outputFile)}`);
    } else {
      console.log('\n' + '━'.repeat(60));
      console.log(' Triage Results');
      console.log('━'.repeat(60));
      console.log(formattedReport);
    }
    console.log('━'.repeat(60) + '\n');

    obs.saveTrace();

  } catch (err) {
    obs.saveTrace();
    if (err.message.includes('Budget exceeded')) {
      console.log(`\n[budget] Triage stopped: ${err.message}`);
    } else {
      console.log(`\n[error] Triage failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    }
  }
}

main();
