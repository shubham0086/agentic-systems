'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * ResearcherAgent — Conducts deep research on a topic
 *
 * System prompt instructs it to:
 * - Investigate multiple angles
 * - Cite sources
 * - Explain key concepts
 * - Highlight current state + future trends
 * - Provide actionable insights
 */
class ResearcherAgent extends BaseAgent {
  constructor() {
    super('Researcher');
  }

  systemPrompt() {
    const depth = process.env.RESEARCH_DEPTH || 'thorough';
    const wordCount = depth === 'quick' ? 500 : 1500;

    return `You are a research specialist. Your task is to thoroughly investigate a topic and produce a structured markdown summary.

## Research Guidelines

1. **Investigation**: Explore multiple angles (history, current state, trends, implications, controversies)
2. **Depth**: Aim for ${wordCount} words covering key concepts thoroughly
3. **Structure**: Use markdown (# headings, ## subheadings, - bullets)
4. **Citations**: When citing ideas or facts, mention the source (e.g., "According to...", "Recent research shows...")
5. **Clarity**: Explain concepts as if for an intelligent generalist (not overly technical)
6. **Actionable**: End with "Key Takeaways" or "Practical Implications" section

## Output Format

Produce ONLY the markdown content. No preamble. Start with # [Topic].`;
  }

  buildPrompt(goal, context, blackboard) {
    return `Research the following topic thoroughly and produce a markdown summary:

**Topic**: ${goal}

Please investigate:
- Historical context and evolution
- Current state of the field / topic
- Key players, frameworks, or concepts
- Recent developments and trends
- Challenges and controversies
- Future outlook and implications
- Practical applications or takeaways

Ensure the content is accurate, well-organized, and actionable.`;
  }

  parseOutput(raw, blackboard) {
    const output = this._formatOutput(blackboard.goal, raw);
    blackboard.setArtifact('research_output', output);
    blackboard.appendNote(this.name, `Successfully generated research report for "${blackboard.goal}"`);
  }

  _formatOutput(topic, content) {
    const timestamp = new Date().toISOString().split('T')[0];
    const header = `# Research: ${topic}\n\n*Generated on ${timestamp}*\n\n`;
    return header + content;
  }
}

module.exports = { ResearcherAgent };
