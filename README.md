# Sauce Demo E-Commerce — Playwright Test Automation Framework

A production-grade, modular Playwright framework for validating business-critical e-commerce flows on [Sauce Demo (Swag Labs)](https://www.saucedemo.com): **login**, **add-to-cart**, **checkout**, and **visual regression**.

Built as a capstone project demonstrating Page Object Model, `storageState` reuse, custom locators, parallel execution, CI/CD integration, and maintainable structure for team adoption.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Visual Regression](#visual-regression)
- [CI/CD (GitHub Actions)](#cicd-github-actions)
- [Docker (Optional)](#docker-optional)
- [Debugging Failures](#debugging-failures)
- [Configuration Reference](#configuration-reference)
- [Test Data & Credentials](#test-data--credentials)
- [Design Decisions](#design-decisions)

---

## Features

| Capability | Implementation |
|------------|----------------|
| **Login flow** | Semantic selectors, redirect assertions to inventory |
| **Cart flow** | Scoped add-to-cart within inventory list, badge count verification |
| **Checkout flow** | Full checkout journey with order confirmation |
| **Auth reuse** | `auth.setup.ts` saves `.auth/user.json`; cart/checkout skip login |
| **Browser contexts** | Isolated `browser.newContext({ storageState })` in cart tests |
| **Custom locators** | `SauceDemoLocators` class for `data-test` attributes |
| **Visual regression** | `toHaveScreenshot()` on inventory grid and checkout success |
| **Parallelism** | 4 workers locally, 2 on CI with retries |
| **CI pipeline** | GitHub Actions with HTML report + failure artifacts |

---

## Project Structure

```
├── .github/workflows/
│   └── playwright.yml          # CI pipeline
├── fixtures/
│   └── test-fixtures.ts        # Custom fixtures (page objects)
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── setup/
│   │   └── auth.setup.ts       # One-time login → storageState
│   ├── login/
│   │   └── login.spec.ts       # Guest login journeys
│   ├── cart/
│   │   └── cart.spec.ts        # Add-to-cart, cart summary
│   ├── checkout/
│   │   └── checkout.spec.ts    # Checkout → order confirmation
│   └── visual/
│       └── inventory.visual.spec.ts  # Screenshot baselines
├── utils/
│   ├── test-data.ts            # Users, products, routes
│   └── custom-locators.ts      # Reusable data-test locators
├── playwright.config.ts        # Retries, workers, baseURL, projects
├── Dockerfile                  # Optional containerized runs
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9+
- Internet access (tests run against `https://www.saucedemo.com`)
- **Git** (optional, for CI)

---

## Setup

```bash
# 1. Clone or extract the project
cd project_playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium

# 4. (Optional) Verify TypeScript — Playwright runs .ts tests natively
npx tsc --noEmit
```

---

## Running Tests

```bash
# Run the full suite (all projects)
npm test

# Run specific flows
npm run test:login
npm run test:cart
npm run test:checkout
npm run test:visual

# CI-equivalent run (Chromium only)
npm run test:ci

# Headed mode (see the browser)
npm run test:headed

# Debug mode (step through with inspector)
npm run test:debug

# Open last HTML report
npm run report
```

### Project execution order

1. **setup** — logs in once, saves `.auth/user.json`
2. **chromium-guest** — login tests (no saved session)
3. **chromium** — cart, checkout, visual tests (reuse `storageState`)

---

## Visual Regression

Baseline screenshots are stored in `tests/visual/*-snapshots/`.

Playwright names snapshots by **platform** (e.g. `chromium-win32` on Windows, `chromium-linux` on GitHub Actions). Both can live in the repo — each OS uses its own file.

### Local (Windows)

```bash
npx playwright test tests/visual --project=chromium --update-snapshots
```

### CI (Linux)

The main workflow **auto-generates Linux baselines on first run** if they are missing, then commits them to `main`.

To manually refresh baselines after an intentional UI change:

1. GitHub → **Actions** → **Update Visual Baselines** → **Run workflow**
2. Or push to `main` and let the bootstrap step run once

Visual checks cover:
- **Inventory grid** — layout, spacing, product cards
- **Checkout success panel** — confirmation message and container

> **Important:** Commit snapshot PNG files to git. If only Windows baselines exist, CI will fail until Linux baselines are generated (handled automatically on the next `main` push after this fix).

---

## CI/CD (GitHub Actions)

Pipeline: `.github/workflows/playwright.yml`

**Triggers:** push to `main`, pull requests to `main`, manual dispatch

**Steps:**
1. Checkout code
2. Node.js 20 + `npm ci`
3. Install Playwright + Chromium (`--with-deps`)
4. Run `npm run test:ci`
5. Upload `playwright-report/` (always)
6. Upload `test-results/` (on failure — traces, screenshots)

**View results:** GitHub → Actions → workflow run → download **playwright-report** artifact → open `index.html`

---

## Docker (Optional)

Run tests in an isolated Linux environment matching CI:

```bash
docker build -t saucedemo-playwright .
docker run --rm saucedemo-playwright
```

The Dockerfile uses the official `mcr.microsoft.com/playwright` image with Node 18 and Chromium pre-installed.

---

## Debugging Failures

| Symptom | Action |
|---------|--------|
| Test timeout | Run `npm run test:headed` to watch behavior |
| Locator not found | Use `npm run codegen` to record selectors |
| Flaky on CI | Check retries in config; review traces in `test-results/` |
| Visual diff failure | Open HTML report → compare Expected / Received / Diff |
| Auth errors | Delete `.auth/` and re-run (setup regenerates session) |

```bash
# Re-run a single failed test
npx playwright test tests/cart/cart.spec.ts --project=chromium --headed

# View trace for a failed run
npx playwright show-trace test-results/<folder>/trace.zip
```

Config enables **traces on first retry**, **screenshots on failure**, and **video on first retry**.

---

## Configuration Reference

Key settings in `playwright.config.ts`:

| Setting | Value | Purpose |
|---------|-------|---------|
| `baseURL` | `https://www.saucedemo.com` | Relative navigation |
| `headless` | `true` | CI-friendly default |
| `workers` | `4` local / `2` CI | Parallel execution |
| `retries` | `2` on CI | Reduce flake |
| `timeout` | `30s` | Per-test limit |
| `fullyParallel` | `true` | Maximize throughput |

---

## Test Data & Credentials

Defined in `utils/test-data.ts`:

| Field | Value |
|-------|-------|
| Username | `standard_user` |
| Password | `secret_sauce` |
| Sample products | Sauce Labs Backpack, Sauce Labs Bike Light |

---

## Design Decisions

1. **Page Object Model** — selectors and actions live in `pages/`; specs stay readable
2. **Custom fixtures** — inject page objects via `fixtures/test-fixtures.ts`
3. **Setup project** — login once, reuse session (no duplicated login steps)
4. **Separate guest vs authenticated projects** — login tests stay independent
5. **Semantic + data-test selectors** — `getByRole`, `getByPlaceholder`, and scoped `data-test` attributes
6. **Visual tests on stable regions** — inventory grid and checkout container, not full-page volatile areas
7. **Chromium-only in CI** — fast, consistent; extend to Firefox/WebKit via config projects

---

## License

ISC
