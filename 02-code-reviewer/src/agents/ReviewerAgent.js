'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * ReviewerAgent — Performs static analysis on a code file to find violations,
 * improvements, and style issues, outputting structured JSON.
 */
class ReviewerAgent extends BaseAgent {
  constructor() {
    super('Reviewer');
  }

  systemPrompt() {
    return `You are an expert static analysis tool and senior code reviewer. Your job is to identify critical violations, code improvements, and style issues in the provided source code.
You must return your findings in JSON format. Do not explain anything outside the JSON block.`;
  }

  buildPrompt(goal, context, blackboard) {
    const code = blackboard.artifacts.code_content || '';
    const filePath = blackboard.artifacts.file_path || '';
    
    return `Review the following code from the file "${filePath}":

\`\`\`
${code}
\`\`\`

Perform a structured review and categorize issues into:
1. **violations**: Critical bugs, security risks (e.g., SQL injection, XSS, hardcoded secrets), resource leaks, or missing error handling.
2. **improvements**: Modularity, performance, maintainability, and code readability recommendations.
3. **style**: Inconsistent formatting, naming convention violations, or trailing whitespace.

Your output MUST be a valid JSON object matching this schema:
{
  "violations": [
    { "line": 12, "issue": "Detailed description of the issue" }
  ],
  "improvements": [
    { "suggestion": "How to improve the code structure" }
  ],
  "style": [
    { "line": 45, "issue": "Style inconsistency description" }
  ]
}

Respond ONLY with the raw JSON object inside a \`\`\`json markdown code block.`;
  }

  parseOutput(raw, blackboard) {
    const clean = BaseAgent.cleanJSON(raw);
    if (clean) {
      blackboard.setArtifact('reviewer_output', clean);
      blackboard.appendNote(this.name, JSON.stringify(clean, null, 2));
    } else {
      blackboard.appendNote(this.name, `[Error] Output was not parseable as JSON. Raw output: ${raw}`);
    }
  }
}

module.exports = { ReviewerAgent };
