'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * WriterAgent — Compiles the researched sections and writes the final markdown blog post.
 */
class WriterAgent extends BaseAgent {
  constructor() {
    super('Writer');
  }

  systemPrompt() {
    return `You are a professional tech writer and copywriter. Your goal is to write a highly engaging, informative, and cohesive blog post using the provided research notes.
Your output must be formatted in clean markdown, ready to publish. Respond ONLY with the blog post content.`;
  }

  buildPrompt(goal, context, blackboard) {
    const summaries = blackboard.artifacts.research_summaries || [];
    
    let researchText = '';
    summaries.forEach(s => {
      researchText += `### Section: ${s.title}\n${s.content}\n\n`;
    });

    return `Write a comprehensive, engaging blog post on the topic: "${goal}".

Here is the research gathered for each section:
${researchText}

Guidelines:
1. **Engaging Title**: Create an attention-grabbing, SEO-friendly headline.
2. **Hook**: Write an introduction that frames the problem and outlines why the reader should care.
3. **Structured Flow**: Draft section content based on the research summaries. Use appropriate headings and lists.
4. **Actionable Takeaways**: Provide a section at the end with clear, practical advice.
5. **Conclusion**: Write a strong conclusion that summarizes the core message.

Do NOT include any introduction text like "Here is your blog post:" or similar. Output ONLY the raw markdown of the blog post.`;
  }

  parseOutput(raw, blackboard) {
    blackboard.setArtifact('blog_post', raw.trim());
    blackboard.appendNote(this.name, `Drafted blog post. Length: ${raw.length} characters.`);
  }
}

module.exports = { WriterAgent };
