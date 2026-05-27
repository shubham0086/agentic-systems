'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * PlannerAgent — Outlines a blog post into sections with descriptions in structured JSON.
 */
class PlannerAgent extends BaseAgent {
  constructor() {
    super('Planner');
  }

  systemPrompt() {
    return `You are a blog strategist and content planner. Your job is to break down a topic into 3-5 logical, engaging sections for a blog post.
You must return your outline in JSON format. Do not explain anything outside the JSON block.`;
  }

  buildPrompt(goal, context, blackboard) {
    return `Create a structured outline for a blog post on the topic: "${goal}".

Break the topic into 3-5 logical sections. Each section must cover a unique aspect of the topic.

Your output MUST be a valid JSON object matching this schema:
{
  "sections": [
    {
      "title": "Clear Section Title",
      "description": "What this section should cover, key points, and what the researcher should focus on."
    }
  ]
}

Respond ONLY with the raw JSON object inside a \`\`\`json markdown code block.`;
  }

  parseOutput(raw, blackboard) {
    const clean = BaseAgent.cleanJSON(raw);
    if (clean && Array.isArray(clean.sections)) {
      blackboard.setArtifact('outline', clean);
      blackboard.appendNote(this.name, JSON.stringify(clean, null, 2));
    } else {
      blackboard.appendNote(this.name, `[Error] Outline output was not parseable as JSON. Raw output: ${raw}`);
    }
  }
}

module.exports = { PlannerAgent };
