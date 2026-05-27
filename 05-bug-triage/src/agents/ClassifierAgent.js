'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * ClassifierAgent — Categorizes the issue report by severity, component,
 * and confidence, outputting structured JSON.
 */
class ClassifierAgent extends BaseAgent {
  constructor() {
    super('Classifier');
  }

  systemPrompt() {
    return `You are a triage support engineer. Your job is to classify inbound bug reports and issues by severity, affected component, and confidence score.
You must return your findings in JSON format. Do not explain anything outside the JSON block.`;
  }

  buildPrompt(goal, context, blackboard) {
    return `Analyze the following issue report:
"${goal}"

Determine:
1. **severity**: "critical" (system is down or data loss is occurring), "high" (major feature broken with no workaround), "medium" (workaround exists or minor bug in non-critical flow), "low" (polishing, styling, typos, or documentation).
2. **component**: "auth", "api", "ui", "database", "infra", or "docs".
3. **confidence**: An integer representing confidence score (0 to 100) based on the clarity of the report.

Your output MUST be a valid JSON object matching this schema:
{
  "severity": "critical|high|medium|low",
  "component": "auth|api|ui|database|infra|docs",
  "confidence": 95
}

Respond ONLY with the raw JSON object inside a \`\`\`json markdown code block.`;
  }

  parseOutput(raw, blackboard) {
    const clean = BaseAgent.cleanJSON(raw);
    if (clean) {
      blackboard.setArtifact('classification', clean);
      blackboard.appendNote(this.name, JSON.stringify(clean, null, 2));
    } else {
      blackboard.appendNote(this.name, `[Error] Classification was not parseable as JSON. Raw output: ${raw}`);
    }
  }
}

module.exports = { ClassifierAgent };
