'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * ResearcherAgent — Iterates through the planned outline and researches each
 * section individually, compiling detailed summaries for each heading.
 */
class ResearcherAgent extends BaseAgent {
  constructor() {
    super('Researcher');
  }

  systemPrompt() {
    return `You are a research analyst. Your job is to gather accurate facts, details, and context for specific sections of a planned blog post.`;
  }

  async execute(blackboard, context = '') {
    const outline = blackboard.artifacts.outline;
    if (!outline || !Array.isArray(outline.sections)) {
      blackboard.appendNote(this.name, 'No outline found in Blackboard. Skipping research phase.');
      return;
    }

    const sysPrompt = this.systemPrompt();
    const researchSummaries = [];

    for (const section of outline.sections) {
      console.log(`    [Researcher] Researching section: "${section.title}"...`);
      const prompt = `Research and gather detailed information for this specific section of a blog post on "${blackboard.goal}":
Section: ${section.title}
Context: ${section.description}

Provide a detailed summary of facts, explanations, and key concepts to include in this section.`;

      try {
        const raw = await this._callWithFallover(sysPrompt, prompt, blackboard);
        researchSummaries.push({
          title: section.title,
          content: raw.trim()
        });
      } catch (err) {
        console.warn(`    [Researcher] Failed to research section "${section.title}": ${err.message}`);
      }
    }

    blackboard.setArtifact('research_summaries', researchSummaries);
    blackboard.appendNote(this.name, `Researched ${researchSummaries.length} sections successfully.`);
  }
}

module.exports = { ResearcherAgent };
