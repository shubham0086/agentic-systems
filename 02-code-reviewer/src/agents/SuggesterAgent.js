'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * SuggesterAgent — Takes reviewer findings and original code, then generates
 * concrete refactoring suggestions with before/after snippets.
 */
class SuggesterAgent extends BaseAgent {
  constructor() {
    super('Suggester');
  }

  systemPrompt() {
    return `You are a refactoring and code modernization expert. Your job is to take original code and a list of code review issues, then generate concrete refactoring suggestions with original and refactored code blocks.
You must return your findings in JSON format. Do not explain anything outside the JSON block.`;
  }

  buildPrompt(goal, context, blackboard) {
    const code = blackboard.artifacts.code_content || '';
    const reviewerNotes = context || '';

    return `Original code:
\`\`\`
${code}
\`\`\`

Here are the code issues identified by the Reviewer agent:
${reviewerNotes}

Generate concrete refactoring suggestions. Your output MUST be a valid JSON object matching this schema:
{
  "refactor_suggestions": [
    {
      "title": "Brief title of the refactoring",
      "explanation": "Why this refactor is needed and how it fixes the violation/improvement",
      "original_code": "The specific lines of code being replaced",
      "refactored_code": "The new refactored code replacement"
    }
  ]
}

Respond ONLY with the raw JSON object inside a \`\`\`json markdown code block.`;
  }

  parseOutput(raw, blackboard) {
    const clean = BaseAgent.cleanJSON(raw);
    if (clean) {
      blackboard.setArtifact('suggester_output', clean);
      blackboard.appendNote(this.name, JSON.stringify(clean, null, 2));
    } else {
      blackboard.appendNote(this.name, `[Error] Output was not parseable as JSON. Raw output: ${raw}`);
    }
  }
}

module.exports = { SuggesterAgent };
