/**
 * AI Agent Prompts
 * Prompt templates for AI-assisted test automation
 */

export interface AgentPromptContext {
  testName?: string;
  pageType?: string;
  actionDescription?: string;
  errorDetails?: string;
  previousAttempts?: string[];
}

export class AgentPrompts {
  /**
   * Generate test case prompt
   */
  public static generateTestCasePrompt(context: AgentPromptContext): string {
    return `
You are an expert QA automation engineer. Generate a comprehensive test case with the following context:
- Test Name: ${context.testName || 'Not specified'}
- Page Type: ${context.pageType || 'Not specified'}

Generate the test case with:
1. Clear test objectives
2. Preconditions
3. Test steps
4. Expected results
5. Postconditions

Format the response as a structured test case that can be automated with Playwright.
`;
  }

  /**
   * Generate test data prompt
   */
  public static generateTestDataPrompt(context: AgentPromptContext): string {
    return `
Generate realistic test data for the following scenario:
- Page Type: ${context.pageType || 'Not specified'}
- Action: ${context.actionDescription || 'Not specified'}

Provide test data in JSON format that includes:
1. Valid data for positive test cases
2. Invalid data for negative test cases
3. Edge cases
4. Boundary conditions

Ensure data is realistic and follows business rules.
`;
  }

  /**
   * Generate locator strategy prompt
   */
  public static generateLocatorStrategyPrompt(context: AgentPromptContext): string {
    return `
Help me create robust element locators for Playwright automation:
- Page Type: ${context.pageType || 'Not specified'}
- Elements to locate: ${context.actionDescription || 'Not specified'}

Provide locator strategies with:
1. Primary locator (CSS selector or XPath)
2. Fallback locators (in case primary fails)
3. Reasoning for each locator choice
4. Best practices for maintainability

Format as TypeScript code examples.
`;
  }

  /**
   * Generate troubleshooting prompt
   */
  public static generateTroubleshootingPrompt(context: AgentPromptContext): string {
    return `
Help me troubleshoot an automation test failure:
- Test Name: ${context.testName || 'Not specified'}
- Error Details: ${context.errorDetails || 'Not specified'}
- Previous Attempts: ${context.previousAttempts?.join(', ') || 'None'}

Provide:
1. Root cause analysis
2. Possible solutions ranked by likelihood
3. Implementation steps for each solution
4. Debugging tips for future similar issues
`;
  }

  /**
   * Generate page object prompt
   */
  public static generatePageObjectPrompt(context: AgentPromptContext): string {
    return `
Generate a Playwright page object for: ${context.pageType || 'Not specified'}

Include:
1. All relevant locators for page elements
2. User interaction methods (click, fill, select, etc.)
3. Assertion methods for page state verification
4. Wait conditions and synchronization points
5. Comprehensive JSDoc comments

Format as TypeScript class that extends a base page object.
`;
  }

  /**
   * Generate assertion strategy prompt
   */
  public static generateAssertionStrategyPrompt(context: AgentPromptContext): string {
    return `
Design comprehensive assertions for: ${context.actionDescription || 'Not specified'}

Provide assertions that verify:
1. Element presence and visibility
2. Correct text/values displayed
3. User interaction feedback
4. Page navigation success
5. Error handling

Format assertions using Playwright's expect() syntax.
`;
  }

  /**
   * Generate performance optimization prompt
   */
  public static generatePerformanceOptimizationPrompt(context: AgentPromptContext): string {
    return `
Help optimize test performance for: ${context.testName || 'Not specified'}

Analyze and suggest optimizations for:
1. Wait times and synchronization
2. Parallel test execution
3. Resource cleanup
4. Network request handling
5. Screenshot/video generation

Provide metrics and expected improvements.
`;
  }

  /**
   * Generate test maintenance prompt
   */
  public static generateTestMaintenancePrompt(context: AgentPromptContext): string {
    return `
Create a maintenance plan for: ${context.testName || 'Not specified'}

Include:
1. Potential areas of brittleness
2. Recommended refactoring points
3. Documentation requirements
4. Version compatibility considerations
5. Test data management strategy
`;
  }

  /**
   * Generate integration testing prompt
   */
  public static generateIntegrationTestingPrompt(context: AgentPromptContext): string {
    return `
Design integration tests connecting:
- Page 1: ${context.pageType || 'Not specified'}
- Test Flow: ${context.actionDescription || 'Not specified'}

Include:
1. End-to-end test scenarios
2. Data flow validation
3. Cross-system interactions
4. Error handling across systems
5. Rollback procedures for failed operations
`;
  }

  /**
   * Generate custom prompt
   */
  public static generateCustomPrompt(template: string, context: AgentPromptContext): string {
    let prompt = template;

    // Replace placeholders
    prompt = prompt.replace('{{testName}}', context.testName || 'Not specified');
    prompt = prompt.replace('{{pageType}}', context.pageType || 'Not specified');
    prompt = prompt.replace('{{actionDescription}}', context.actionDescription || 'Not specified');
    prompt = prompt.replace('{{errorDetails}}', context.errorDetails || 'Not specified');
    prompt = prompt.replace('{{previousAttempts}}', context.previousAttempts?.join(', ') || 'None');

    return prompt;
  }
}
