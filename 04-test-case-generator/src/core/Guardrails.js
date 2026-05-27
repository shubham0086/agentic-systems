'use strict';

class GuardrailError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GuardrailError';
  }
}

/**
 * Guardrails — Input validation & Output sanitization for secure AI agent runs
 */
class Guardrails {
  static validateInput(goal, context = '') {
    const injectionPatterns = [
      /ignore\s+previous\s+instructions/i,
      /ignore\s+above\s+instructions/i,
      /disregard\s+all\s+rules/i,
      /override\s+system\s+prompt/i,
      /you\s+are\s+now\s+free\s+from/i,
      /new\s+system\s+instructions/i,
    ];

    const inputString = `${goal} ${context}`;

    for (const pattern of injectionPatterns) {
      if (pattern.test(inputString)) {
        throw new GuardrailError(`Security violation: Potential prompt injection detected matching pattern ${pattern}`);
      }
    }
  }

  static sanitizeOutput(output) {
    if (typeof output !== 'string') return output;

    const secretPatterns = {
      openaiKey: /sk-[a-zA-Z0-9]{32,}/g,
      openaiProjKey: /sk-proj-[a-zA-Z0-9_-]{32,}/g,
      anthropicKey: /sk-ant-[a-zA-Z0-9_-]{32,}/g,
      googleKey: /AIzaSy[a-zA-Z0-9_-]{33}/g,
    };

    let sanitized = output;

    // Redact keys
    sanitized = sanitized.replace(secretPatterns.openaiKey, '***[REDACTED OPENAI KEY]***');
    sanitized = sanitized.replace(secretPatterns.openaiProjKey, '***[REDACTED OPENAI PROJECT KEY]***');
    sanitized = sanitized.replace(secretPatterns.anthropicKey, '***[REDACTED ANTHROPIC KEY]***');
    sanitized = sanitized.replace(secretPatterns.googleKey, '***[REDACTED GOOGLE API KEY]***');

    return sanitized;
  }
}

module.exports = { Guardrails, GuardrailError };
