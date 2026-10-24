// lib/pipelineData.js - Shipyard / Action Lab Pipeline Specification
// Protocol Phi (Φ-0.1) & GitHub Actions Interactive Explorer

export const PIPELINE_STAGES = [
  {
    id: 'checkout-mandate',
    name: '1. Checkout & Mandate Proof',
    shortName: 'Checkout',
    runner: 'ubuntu-latest',
    durationSec: 1.8,
    status: 'success',
    badge: 'Zero-Trust Gate',
    description: 'Fetches code in isolated worktree and verifies agent authorization via Protocol Phi Ed25519 mandate.',
    yamlSnippet: `- name: Checkout Repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 1
    clean: true

- name: Verify Protocol Phi Mandate
  env:
    AGENT_MANDATE: \${{ secrets.AGENT_MANDATE_PROOF }}
  run: |
    echo "::group::Mandate Authentication"
    python -m ssi.verify_mandate \\
      --agent "did:key:z6Mkw...#agy@wolfram" \\
      --intent "BUILD_AND_TEST"
    echo "::endgroup::"`,
    logs: [
      { time: '00:00.12', stream: 'stdout', text: 'Initializing GitHub Actions runner on ubuntu-latest (host: gh-runner-e24)...' },
      { time: '00:00.35', stream: 'stdout', text: 'Fetching target git branch minutta/min-200-nightathon-udivi-menya-free-flight-cloud-codex-github...' },
      { time: '00:00.82', stream: 'stdout', text: 'HEAD is now at 957a38c (Action Lab interactive workflow explorer)' },
      { time: '00:01.05', stream: 'stdout', text: '::group::Mandate Authentication' },
      { time: '00:01.20', stream: 'stdout', text: '[Protocol Phi] Resolving TXT _mandate.agy.hackt.com via goDNS...' },
      { time: '00:01.44', stream: 'stdout', text: '[Protocol Phi] Cryptographic Proof-of-Possession valid (Ed25519 signature OK)' },
      { time: '00:01.65', stream: 'stdout', text: '[Zero-Trust] Workspace boundary confirmed: clean checkout isolated from host.' },
      { time: '00:01.78', stream: 'stdout', text: '::endgroup::' },
      { time: '00:01.80', stream: 'stdout', text: 'Stage completed with exit code 0.' }
    ],
    phiEnvelope: {
      proto: 'phi-0.1',
      sender: 'did:key:z6Mkw...#agy@wolfram',
      recipient: 'github-actions://runner-worker',
      mandate_id: 'MANDATE-WOLFRAM-20261024-NIGHTATHON',
      intent: 'TASK_DISPATCH',
      git: {
        repo: 'pashamango/actions-learning-pathway',
        branch: 'minutta/min-200-nightathon-udivi-menya-free-flight-cloud-codex-github',
        commit_sha: '957a38c'
      }
    }
  },
  {
    id: 'setup-runtime',
    name: '2. Runtime Setup & Dependency Cache',
    shortName: 'Setup',
    runner: 'ubuntu-latest',
    durationSec: 3.2,
    status: 'success',
    badge: 'Cache Hit',
    description: 'Installs Node.js v20.x, restores npm cache key, and performs deterministic dependency lockfile verification.',
    yamlSnippet: `- name: Setup Node.js Runtime
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm'
    cache-dependency-path: 'package-lock.json'

- name: Install Dependencies
  run: |
    npm ci --prefer-offline --no-audit
    npm ls --depth=0`,
    logs: [
      { time: '00:00.10', stream: 'stdout', text: 'Found in cache: node-v20.18.0-linux-x64' },
      { time: '00:00.45', stream: 'stdout', text: 'Restoring cache from key: Linux-npm-cache-b5df21a8...' },
      { time: '00:01.20', stream: 'stdout', text: 'Cache restored successfully (84.2 MB in 0.75s).' },
      { time: '00:01.40', stream: 'stdout', text: 'Executing npm ci --prefer-offline...' },
      { time: '00:02.85', stream: 'stdout', text: 'added 306 packages in 1.45s (0 vulnerabilities found)' },
      { time: '00:03.10', stream: 'stdout', text: 'Verified package integrity against package-lock.json sha512 checksums.' },
      { time: '00:03.20', stream: 'stdout', text: 'Stage completed with exit code 0.' }
    ],
    phiEnvelope: {
      proto: 'phi-0.1',
      stage: 'DEPENDENCY_AUDIT',
      integrity: 'sha256:d8a291f0c29188a10b4458d92837bc901ef'
    }
  },
  {
    id: 'lint-test',
    name: '3. Quality Gate & Behavioral Tests',
    shortName: 'Test & Lint',
    runner: 'ubuntu-latest',
    durationSec: 2.4,
    status: 'success',
    badge: '100% Pass',
    description: 'Runs non-interactive ESLint Core Web Vitals checks and automated pipeline state machine unit tests.',
    yamlSnippet: `- name: ESLint Code Quality
  run: npm run lint

- name: Pipeline Unit & State Machine Tests
  run: npm run test:unit`,
    logs: [
      { time: '00:00.15', stream: 'stdout', text: 'Running next lint with .eslintrc.json config...' },
      { time: '00:01.05', stream: 'stdout', text: '✔ No ESLint warnings or errors detected.' },
      { time: '00:01.20', stream: 'stdout', text: 'Running node --test tests/pipeline.test.mjs...' },
      { time: '00:01.55', stream: 'stdout', text: '✔ stage count matches expected 5 stages (0.002s)' },
      { time: '00:01.70', stream: 'stdout', text: '✔ state transitions validate correctly across simulation (0.003s)' },
      { time: '00:01.90', stream: 'stdout', text: '✔ Protocol Phi envelope format conforms to Φ-0.1 spec (0.001s)' },
      { time: '00:02.15', stream: 'stdout', text: '✔ static export configuration has no server route dependencies (0.001s)' },
      { time: '00:02.35', stream: 'stdout', text: 'ℹ tests 4 | pass 4 | fail 0 | cancelled 0 | skipped 0' },
      { time: '00:02.40', stream: 'stdout', text: 'Stage completed with exit code 0.' }
    ],
    phiEnvelope: {
      proto: 'phi-0.1',
      stage: 'TEST_VERIFICATION',
      tests_passed: 4,
      verdict: 'PASS'
    }
  },
  {
    id: 'static-build',
    name: '4. Next.js Static Export & Optimization',
    shortName: 'Build',
    runner: 'ubuntu-latest',
    durationSec: 4.1,
    status: 'success',
    badge: 'Static Output',
    description: 'Generates production static HTML/CSS/JS artifacts with automatic asset hashing for GitHub Pages.',
    yamlSnippet: `- name: Build Static Export
  run: |
    npm run build
    test -f out/index.html && test -f out/404.html
  env:
    NODE_ENV: production`,
    logs: [
      { time: '00:00.20', stream: 'stdout', text: 'Creating an optimized production build...' },
      { time: '00:01.80', stream: 'stdout', text: 'Compiled successfully in 1.6s' },
      { time: '00:02.10', stream: 'stdout', text: 'Generating static pages (3/3)...' },
      { time: '00:02.90', stream: 'stdout', text: 'Finalizing page optimization...' },
      { time: '00:03.20', stream: 'stdout', text: 'Route (pages)                              Size     First Load JS' },
      { time: '00:03.30', stream: 'stdout', text: '┌ ○ /                                      5.12 kB        84.1 kB' },
      { time: '00:03.40', stream: 'stdout', text: '├   └ css/shipyard.css                     2.10 kB' },
      { time: '00:03.50', stream: 'stdout', text: '└ ○ /404                                   181 B          79.4 kB' },
      { time: '00:03.80', stream: 'stdout', text: 'Exported static bundle into /out directory.' },
      { time: '00:04.10', stream: 'stdout', text: 'Stage completed with exit code 0.' }
    ],
    phiEnvelope: {
      proto: 'phi-0.1',
      stage: 'BUILD_ARTIFACT',
      output_dir: 'out/',
      total_size_kb: 84.1
    }
  },
  {
    id: 'deploy-canary',
    name: '5. GitHub Pages Deployment & Agent Gate',
    shortName: 'Deploy',
    runner: 'ubuntu-latest',
    durationSec: 2.9,
    status: 'success',
    badge: '1-Tap Gate',
    description: 'Packages Pages artifact, runs zero-trust integrity assertion, and emits Protocol Phi verifiable receipt.',
    yamlSnippet: `- name: Upload GitHub Pages Artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './out'

- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v4

- name: Emit Protocol Phi Receipt
  run: |
    echo "<!-- phi-receipt:PASS sha=\${{ steps.deployment.outputs.page_url }} -->" >> \$GITHUB_STEP_SUMMARY`,
    logs: [
      { time: '00:00.25', stream: 'stdout', text: 'Packaging static artifact ./out into pages.tar.gz (compress level 6)...' },
      { time: '00:00.90', stream: 'stdout', text: 'Artifact successfully uploaded to GitHub Pages storage (ID: 98124018).' },
      { time: '00:01.40', stream: 'stdout', text: 'Initiating deployment request to github-pages environment...' },
      { time: '00:02.10', stream: 'stdout', text: 'Status: Provisioned -> Active. URL: https://pashamango.github.io/actions-learning-pathway/' },
      { time: '00:02.50', stream: 'stdout', text: '[Protocol Phi] Emitting machine-readable receipt <!-- phi-receipt:PASS -->...' },
      { time: '00:02.80', stream: 'stdout', text: 'Single-tap sovereign gate: PASS certified for Principal review.' },
      { time: '00:02.90', stream: 'stdout', text: 'Stage completed with exit code 0.' }
    ],
    phiEnvelope: {
      proto: 'phi-0.1',
      intent: 'QA_VERDICT_PASS',
      receipt: {
        verdict: 'PASS',
        url: 'https://pashamango.github.io/actions-learning-pathway/',
        deploy_timestamp: '2026-10-24T06:50:00Z',
        checks: ['checkout-mandate', 'setup-runtime', 'lint-test', 'static-build', 'deploy-canary']
      }
    }
  }
];

export const WORKFLOW_METRICS = {
  version: '1.0.0',
  repository: 'pashamango/actions-learning-pathway',
  branch: 'minutta/min-200-nightathon-udivi-menya-free-flight-cloud-codex-github',
  totalExecutionSec: 14.4,
  bundleSizeKb: 84.1,
  guardrailScore: '100% Compliant',
  agentRoles: {
    originator: 'codex@cloud (Concept & Architecture)',
    synthesizer: 'agy@wolfram (Implementation & Build Verification)',
    gatekeeper: 'Pavel Cherkashin (Sovereign 1-Tap)'
  }
};
