# AIPROJECT - Playwright E2E Tests

Automated end-to-end testing suite using Playwright and TypeScript.

## Test Cases

- **iPhone Checkout Flow**: Login, add iPhone X to cart, and verify checkout

## Setup

```bash
npm install
npx playwright install
```

## Run Tests

```bash
npm test
```

### Run with GUI

```bash
npx playwright test --headed
```

### View HTML Report

```bash
npx playwright show-report
```

## Project Structure

```
tests/
├── e2e/
│   └── iphone-checkout.spec.ts
playwright.config.ts
package.json
tsconfig.json
```
