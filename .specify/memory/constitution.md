<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → I. JavaScript for React Components
  - [PRINCIPLE_2_NAME] → II. CSS Modules for Styling
  - [PRINCIPLE_3_NAME] → III. Test-First (NON-NEGOTIABLE)
  - [PRINCIPLE_4_NAME] → IV. Integration Testing
  - [PRINCIPLE_5_NAME] → V. Simplicity
- Added sections: N/A
- Removed sections: N/A
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: N/A
-->
# try-custom-univer-sheet-import-and-export-feature Constitution

## Core Principles

### I. JavaScript for React Components
This React project uses JavaScript. Do not use TypeScript to write React components. If there are any existing TypeScript components, they must be converted to JavaScript.

### II. CSS Modules for Styling
This project uses CSS Modules for styling. Do not use Tailwind CSS. If Tailwind CSS is used, it must be converted to CSS Modules.

### III. Test-First (NON-NEGOTIABLE)
TDD is mandatory. Tests must be written and approved by the user before implementation. The Red-Green-Refactor cycle is strictly enforced.

### IV. Integration Testing
Integration tests are required for new library contract tests, contract changes, inter-service communication, and shared schemas.

### V. Simplicity
Start with the simplest solution and adhere to "You Ain't Gonna Need It" (YAGNI) principles.

## Development Workflow

All code changes must be submitted through a pull request and reviewed by at least one other developer. All tests must pass before a pull request can be merged.

## Governance
This constitution supersedes all other practices. Amendments to this constitution require documentation, approval, and a migration plan. All pull requests and reviews must verify compliance with this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-01-14 | **Last Amended**: 2026-01-14