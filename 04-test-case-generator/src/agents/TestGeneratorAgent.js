'use strict';
const { BaseAgent } = require('../core/BaseAgent');

/**
 * TestGeneratorAgent — Reads code and generates a comprehensive Jest test suite
 * including happy paths, edge cases, and error handling.
 */
class TestGeneratorAgent extends BaseAgent {
  constructor() {
    super('TestGenerator');
  }

  systemPrompt() {
    return `You are a specialized test engineer. Your task is to analyze a function and write clean, structured, and comprehensive unit tests using Jest.
You must return only the executable Jest test suite code. Do not explain anything outside the code block.`;
  }

  buildPrompt(goal, context, blackboard) {
    const code = blackboard.artifacts.code_content || '';
    const functionName = blackboard.artifacts.function_name || '';

    return `Generate a comprehensive Jest unit test suite for the function "${functionName}" located in this file:

\`\`\`javascript
${code}
\`\`\`

Ensure your test suite covers:
1. **Happy Paths**: Correct behavior under normal valid inputs.
2. **Edge Cases**: Boundary conditions, empty inputs, null/undefined, or extreme values.
3. **Error Handling**: Testing that invalid inputs throw the expected errors or handle failure gracefully.
4. **Fixtures**: Proper setup of test data/objects.

Your output MUST be a valid Jest test file. Do not include introductory text. Respond ONLY with the Jest code inside a \`\`\`javascript markdown code block.`;
  }

  parseOutput(raw, blackboard) {
    // Extract the javascript block from output
    const match = raw.match(/```(?:javascript|js)?\s*([\s\S]*?)```/);
    const code = match ? match[1] : raw;
    blackboard.setArtifact('test_code', code.trim());
    blackboard.appendNote(this.name, `Generated Jest unit tests for "${blackboard.artifacts.function_name}"`);
  }
}

module.exports = { TestGeneratorAgent };
