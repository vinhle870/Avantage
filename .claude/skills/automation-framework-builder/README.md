# Automation Framework Builder Skill

## Overview

This skill provides comprehensive guidance for building a production-grade test automation framework with 10+ years of SDET expertise. It combines Playwright, Page Object Model (POM), Builder pattern, and global configuration management into a cohesive, maintainable testing architecture.

## When to Use This Skill

Trigger this skill when you want to:
- **"Build automation framework"** — Create complete project structure
- **"Initialize automation framework"** — Set up with all components
- **"Create framework architecture"** — Design framework from scratch
- **"Set up Playwright framework"** — Generate Playwright-based automation suite
- **"Implement POM pattern"** — Centralize UI locator management
- **"Add builder pattern"** — Create fluent test data builders
- **"Configure global settings"** — Set up environment-aware configuration

## Framework Highlights

### 🏗️ Architecture
- **Playwright** — Cross-browser, reliable automation engine
- **Page Object Model** — Centralized UI locator management
- **Builder Pattern** — Fluent, reusable test data construction
- **Global Configuration** — Environment-aware settings with `@use` annotation
- **Modular Design** — Reusable, scalable components

### 📁 Structure
```
src/
├── config/          # Configuration management
├── pages/           # Page Object Models
├── builders/        # Test Data Builders
├── fixtures/        # Test fixtures & setup
└── utils/          # Helper utilities
tests/              # Test files
```

### ⚡ Key Features

| Feature | Benefit |
|---------|---------|
| **@use Annotation** | Direct access to global config in tests |
| **Builder Pattern** | Fluent test data with validation |
| **POM** | Maintainable, reusable UI interactions |
| **Base Classes** | Reduced code duplication |
| **Utility Helpers** | Logger, Waiter, Screenshot utilities |
| **CI/CD Ready** | GitHub Actions, Jenkins compatible |

## Quick Start

1. Review the **SKILL.md** file for complete implementation guide
2. Follow the 10-step implementation process
3. Start with Step 1: Project Setup & Dependencies
4. Progress through each phase sequentially

## File Organization

```
automation-framework-builder/
├── SKILL.md          ← Main skill documentation (10 steps)
├── README.md         ← This file
└── templates/        ← Code templates (coming next)
```

## 10-Step Implementation Journey

| Step | Focus | Deliverable |
|------|-------|-------------|
| 1 | Dependencies | `package.json`, `tsconfig.json` |
| 2 | Configuration | `config.ts`, `@use` fixture |
| 3 | POM | `BasePage.ts`, specific pages |
| 4 | Builders | `UserBuilder.ts`, `BaseBuilder.ts` |
| 5 | Utilities | Logger, Waiter, Helpers |
| 6 | Playwright Config | `playwright.config.ts` |
| 7 | Environment Config | `.env.example` |
| 8 | NPM Scripts | Test execution commands |
| 9 | Best Practices | Test patterns, anti-patterns |
| 10 | CI/CD | GitHub Actions, deployment |

## Success Criteria

✅ All 10 steps completed
✅ Tests pass locally across all browsers
✅ CI/CD pipeline automated
✅ Team trained on patterns
✅ <2% flake rate in execution

## Support & Questions

For detailed implementation guidance, refer to the **SKILL.md** file and follow each step systematically.

---

**Skill Level:** Advanced SDET / 10+ years experience
**Framework:** Playwright 1.40+
**Language:** TypeScript 5.0+
**License:** Internal Use
