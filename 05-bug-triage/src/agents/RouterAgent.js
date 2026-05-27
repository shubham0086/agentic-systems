'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * RouterAgent — Reviews the issue description and the Classifier's tags,
 * then recommends which internal engineering team should resolve it.
 */
class RouterAgent extends BaseAgent {
  constructor() {
    super('Router');
  }

  systemPrompt() {
    return `You are a project manager and systems router. Your job is to assign issues to engineering teams and provide next-step actions based on classification tags.
You must return your recommendation in JSON format. Do not explain anything outside the JSON block.`;
  }

  buildPrompt(goal, context, blackboard) {
    const classification = blackboard.artifacts.classification || {};

    return `Analyze the original issue report:
"${goal}"

Using the Classifier agent's tags:
- Severity: ${classification.severity}
- Component: ${classification.component}
- Confidence: ${classification.confidence}%

Determine:
1. **suggested_team**: Which engineering team ("backend", "frontend", "infrastructure", or "documentation") is best suited.
2. **reasoning**: A short explanation for the routing decision.
3. **next_action**: Directives for debugging or initial triage verification.

Your output MUST be a valid JSON object matching this schema:
{
  "suggested_team": "backend|frontend|infrastructure|documentation",
  "reasoning": "Detailed justification of team assignment",
  "next_action": "Initial checklist or check for the developer"
}

Respond ONLY with the raw JSON object inside a \`\`\`json markdown code block.`;
  }

  parseOutput(raw, blackboard) {
    const clean = BaseAgent.cleanJSON(raw);
    if (clean) {
      blackboard.setArtifact('routing', clean);
      blackboard.appendNote(this.name, JSON.stringify(clean, null, 2));
    } else {
      blackboard.appendNote(this.name, `[Error] Routing was not parseable as JSON. Raw output: ${raw}`);
    }
  }
}

module.exports = { RouterAgent };
