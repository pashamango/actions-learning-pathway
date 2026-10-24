# [Draft PR] Shipyard: Turn static demo into interactive GitHub Actions workflow explorer

**Target Repository:** `pashamango/actions-learning-pathway`  
**Base Branch:** `main`  
**Compare Branch:** `minutta/min-200-nightathon-udivi-menya-free-flight-cloud-codex-github`  
**Status:** DRAFT (Not submitted per outbound guardrails)  

---

## Overview

This pull request transforms the minimal single-line placeholder in `actions-learning-pathway` into **Shipyard (Action Lab)**: an interactive GitHub Actions workflow explorer, runner simulator, and Protocol Phi (&Phi;-0.1) sovereign agent gatekeeper demo.

## Key Changes

1. **Interactive Workflow Pipeline:**
   - 5 selectable pipeline stages: Checkout & Mandate Proof, Runtime Setup & Cache, Quality & Security Gate, Static Export & Optimization, Deploy & Agent Gate.
   - Interactive runner simulation with speed control (1x, 2x, 5x) and step-by-step playback.
   - Terminal console view with realistic ANSI logs, Actions YAML definitions, and Protocol Phi envelopes.

2. **Protocol Phi (&Phi;-0.1) Zero-Trust Integration:**
   - Demonstrates modern AI agent interoperability with CI/CD.
   - Cryptographic Proof-of-Possession and signed machine-readable receipts (`<!-- phi-receipt:PASS -->`).

3. **Accessibility & Responsive Polish:**
   - Keyboard navigation shortcuts (`[Space]`, `[1-5]`, `[R]`).
   - Accessible WCAG AAA contrast and `@media (prefers-reduced-motion: reduce)` support.
   - Fully responsive for mobile and desktop screens.

4. **Production Quality & Static Export:**
   - Non-interactive ESLint setup with `.eslintrc.json`.
   - Node.js built-in unit tests (`tests/pipeline.test.mjs`).
   - Clean Next.js static export targeting GitHub Pages (`out/`).

## Verification Commands

```bash
# 1. Run unit tests
npm run test:unit

# 2. Run non-interactive lint
npm run lint

# 3. Build static export
npm run build

# 4. Check static artifacts
test -f out/index.html && test -f out/404.html
```

## Guardrail Notice

In strict accordance with the MIN-200 Nightathon guidelines, this PR remains in draft form and has not been published to GitHub.
