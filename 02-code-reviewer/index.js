'use strict';
/**
 * Code Reviewer — Clonable System 02
 *
 * Usage:
 *   node index.js --file src/core/BaseAgent.js
 *   node index.js --file src/core/BaseAgent.js --output review-baseagent.md
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Blackboard } = require('./src/core/Blackboard');
const { DAGRunner } = require('./src/core/DAGRunner');
const { ReviewerAgent } = require('./src/agents/ReviewerAgent');
const { SuggesterAgent } = require('./src/agents/SuggesterAgent');
const { Observability } = require('./src/core/Observability');

async function main() {
  // Parse command-line arguments
  const fileIdx = process.argv.indexOf('--file');
  if (fileIdx === -1 || !process.argv[fileIdx + 1]) {
    console.error('[Error] Please specify a code file to review using --file <filepath>');
    process.exit(1);
  }
  const filePath = process.argv[fileIdx + 1];

  if (!fs.existsSync(filePath)) {
    console.error(`[Error] File not found: ${filePath}`);
    process.exit(1);
  }

  const outputIdx = process.argv.indexOf('--output');
  const outputFile = outputIdx !== -1
    ? process.argv[outputIdx + 1]
    : `review-${path.basename(filePath).replace(/\.[^/.]+$/, "")}.md`;

  console.log('\n' + '━'.repeat(60));
  console.log(' Code Reviewer System (DAG)');
  console.log('━'.repeat(60));
  console.log(`File to review: ${filePath}`);
  console.log(`Output:         ${outputFile}\n`);

  const codeContent = fs.readFileSync(filePath, 'utf-8');

  // Set up Observability & Blackboard
  const goalStr = `Review file: ${filePath}`;
  const obs = new Observability(goalStr);
  const blackboard = new Blackboard(goalStr);
  blackboard.setArtifact('observability', obs);
  blackboard.setArtifact('file_path', filePath);
  blackboard.setArtifact('code_content', codeContent);

  // Set up Agents
  const reviewer = new ReviewerAgent();
  const suggester = new SuggesterAgent();

  // Set up DAG execution
  const runner = new DAGRunner();
  runner.addNode('Reviewer', reviewer);
  runner.addNode('Suggester', suggester, ['Reviewer']);

  const startTime = Date.now();

  try {
    // Execute DAG
    await runner.run(blackboard);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const summary = blackboard.summary();

    // Compile review findings to markdown
    const reviewResult = compileMarkdownReview(blackboard, filePath);
    fs.writeFileSync(outputFile, reviewResult, 'utf-8');

    // Summary
    console.log('\n' + '━'.repeat(60));
    console.log(' Code Review Complete');
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
      console.log(`\n[budget] Review stopped: ${err.message}`);
    } else {
      console.log(`\n[error] Review failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    }
  }
}

function compileMarkdownReview(blackboard, filePath) {
  const reviewerOut = blackboard.artifacts.reviewer_output || {};
  const suggesterOut = blackboard.artifacts.suggester_output || {};
  const timestamp = new Date().toISOString().split('T')[0];

  let md = `# Code Review: ${path.basename(filePath)}\n\n`;
  md += `*Generated on ${timestamp} by Multi-Agent Code Reviewer*\n\n`;
  md += `**Target File**: \`${filePath}\`\n\n`;

  md += `## ⚠️ Violations (Critical Issues)\n\n`;
  if (Array.isArray(reviewerOut.violations) && reviewerOut.violations.length > 0) {
    reviewerOut.violations.forEach(v => {
      md += `- **[Line ${v.line}]**: ${v.issue}\n`;
    });
  } else {
    md += `*No critical violations found.*\n`;
  }
  md += `\n`;

  md += `## 💡 Improvements & Refactoring Recommendations\n\n`;
  if (Array.isArray(reviewerOut.improvements) && reviewerOut.improvements.length > 0) {
    reviewerOut.improvements.forEach(imp => {
      md += `- ${imp.suggestion}\n`;
    });
  } else {
    md += `*No structural improvements recommended.*\n`;
  }
  md += `\n`;

  md += `## 💅 Style Inconsistencies\n\n`;
  if (Array.isArray(reviewerOut.style) && reviewerOut.style.length > 0) {
    reviewerOut.style.forEach(s => {
      md += `- **[Line ${s.line}]**: ${s.issue}\n`;
    });
  } else {
    md += `*Code style is consistent.*\n`;
  }
  md += `\n`;

  md += `## 🛠 Concrete Refactoring Suggestions\n\n`;
  if (Array.isArray(suggesterOut.refactor_suggestions) && suggesterOut.refactor_suggestions.length > 0) {
    suggesterOut.refactor_suggestions.forEach((ref, index) => {
      md += `### ${index + 1}. ${ref.title}\n\n`;
      md += `${ref.explanation}\n\n`;
      
      md += `**Original Code:**\n`;
      md += `\`\`\`javascript\n${ref.original_code}\n\`\`\`\n\n`;
      
      md += `**Refactored Code:**\n`;
      md += `\`\`\`javascript\n${ref.refactored_code}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });
  } else {
    md += `*No refactoring suggestions available.*\n`;
  }

  return md;
}

main();
