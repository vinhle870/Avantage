# Playwright Automation - Avantage

Converted from Selenium-Java (Serenity BDD + JUnit 5) to Playwright-TypeScript.

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run admin portal tests only
npm run test:admin

# Run dealer portal tests only
npm run test:dealer

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run report
```

## Project Structure

```
src/
├── core/           # Base components and utilities
├── pages/          # Page Object classes
├── data/           # Test data and configuration
└── tests/          # Test specifications
```

## Configuration

Edit `.env` file to configure:
- Portal URLs
- Test credentials
- Environment settings
