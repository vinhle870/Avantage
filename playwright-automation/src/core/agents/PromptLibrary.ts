/**
 * Agent Prompts Library
 * Pre-defined prompt templates for common automation tasks
 */

export const AgentPromptLibrary = {
  // Test Case Generation
  testCaseTemplate: `
You are an expert QA automation engineer specializing in {{testingFramework}}.
Generate a comprehensive test case for {{testScenario}}.

Include:
1. Test objective and description
2. Preconditions
3. Step-by-step test steps
4. Expected results for each step
5. Postconditions and cleanup

Ensure the test case is:
- Clear and concise
- Reusable and maintainable
- Based on user workflows
- Comprehensive in coverage
`,

  // Test Data Generation
  testDataTemplate: `
Generate realistic test data for {{dataType}} in {{context}}.

Include:
1. Valid test data (happy path)
2. Invalid test data (negative scenarios)
3. Edge cases and boundary values
4. Special characters and Unicode
5. Large datasets if applicable

Format as JSON and ensure data:
- Follows business rules
- Is representative of production data
- Includes diverse scenarios
`,

  // Locator Strategy
  locatorTemplate: `
Create robust element locators for Playwright for {{pageElement}} on {{pageType}}.

Provide:
1. Primary CSS selector
2. XPath alternative
3. Test ID selector (if applicable)
4. Accessibility-based locator
5. Reasoning for each approach

Format as TypeScript code and prioritize:
- Stability and maintainability
- Uniqueness and specificity
- Resilience to DOM changes
`,

  // Failure Troubleshooting
  troubleshootTemplate: `
Help troubleshoot an automation test failure:
- Error: {{errorMessage}}
- Context: {{context}}
- Recent changes: {{changes}}

Provide:
1. Root cause analysis
2. 3 likely solutions (ranked by probability)
3. Debugging steps
4. Prevention strategies
5. Code examples for fixes
`,

  // Page Object Generation
  pageObjectTemplate: `
Generate a Playwright page object for {{pageType}}.

Include:
1. All primary UI elements with locators
2. User interaction methods
3. Assertion/verification methods
4. Wait and synchronization helpers
5. Data retrieval methods
6. JSDoc documentation

Format as TypeScript class with:
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Clear method naming
- Error handling
`,

  // Assertion Strategy
  assertionTemplate: `
Design comprehensive assertions for {{scenario}}.

Include assertions for:
1. Element visibility and availability
2. Text content verification
3. Attribute validation
4. State changes
5. Navigation success
6. Error/success messages
7. Data accuracy

Use Playwright expect() syntax with:
- Meaningful assertion messages
- Appropriate timeout values
- Error descriptions
`,

  // Performance Optimization
  performanceTemplate: `
Optimize test performance for {{testName}}.

Analyze:
1. Current wait times and synchronization
2. Parallel execution possibilities
3. Resource management (memory, files)
4. Network request optimization
5. Screenshot/video generation efficiency

Suggest improvements with:
- Expected time savings
- Implementation effort
- Risk assessment
- Metrics for measurement
`,

  // Test Maintenance
  maintenanceTemplate: `
Create a maintenance plan for {{testName}}.

Address:
1. Brittle elements and how to fix them
2. Code refactoring opportunities
3. Documentation gaps
4. Version compatibility issues
5. Test data management strategy
6. Environmental dependencies
`,

  // Integration Testing
  integrationTemplate: `
Design integration tests for {{workflow}}.

Include:
1. End-to-end test scenarios
2. Data flow validation across pages
3. State synchronization checks
4. Error handling and rollback
5. Performance baselines
6. Cross-browser considerations
`,

  // Custom Scenario
  customTemplate: `
Provide automation guidance for:
{{customDescription}}

Consider:
1. Best practices for {{domain}}
2. Common pitfalls and how to avoid them
3. Optimal tooling and frameworks
4. Code organization and structure
5. Testing strategies and coverage
6. Maintenance and scalability
`,
};

/**
 * Prompt parameter extractor
 */
export function extractPromptParameters(prompt: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const matches: string[] = [];
  let match;

  while ((match = regex.exec(prompt)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

/**
 * Interpolate prompt with values
 */
export function interpolatePrompt(
  template: string,
  values: Record<string, string>
): string {
  let result = template;

  Object.entries(values).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  });

  return result;
}

/**
 * Validate prompt has all required parameters filled
 */
export function validatePrompt(prompt: string): boolean {
  return !prompt.includes('{{') || !prompt.includes('}}');
}
