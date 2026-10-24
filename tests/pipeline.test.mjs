// tests/pipeline.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { PIPELINE_STAGES, WORKFLOW_METRICS } from '../lib/pipelineData.js';

test('pipeline specification structure', (t) => {
  assert.equal(PIPELINE_STAGES.length, 5, 'Must contain exactly 5 workflow stages');
  
  const expectedIds = ['checkout-mandate', 'setup-runtime', 'lint-test', 'static-build', 'deploy-canary'];
  PIPELINE_STAGES.forEach((stage, idx) => {
    assert.equal(stage.id, expectedIds[idx], `Stage index ${idx} must have id ${expectedIds[idx]}`);
    assert.ok(stage.name && stage.name.length > 0, 'Stage name required');
    assert.ok(stage.runner && stage.runner.length > 0, 'Stage runner required');
    assert.ok(stage.yamlSnippet && stage.yamlSnippet.length > 0, 'YAML snippet required');
    assert.ok(Array.isArray(stage.logs) && stage.logs.length > 0, 'Stage logs required');
    assert.ok(stage.phiEnvelope && stage.phiEnvelope.proto === 'phi-0.1', 'Protocol Phi envelope required');
  });
});

test('pipeline timing and simulation invariants', (t) => {
  let calculatedDuration = 0;
  PIPELINE_STAGES.forEach((stage) => {
    assert.ok(stage.durationSec > 0, 'Stage duration must be positive');
    calculatedDuration += stage.durationSec;
  });
  
  assert.ok(calculatedDuration > 10, 'Total pipeline execution time should represent realistic runner timings');
  assert.equal(WORKFLOW_METRICS.repository, 'pashamango/actions-learning-pathway');
});

test('Protocol Phi receipt formatting and cryptographic coordinates', (t) => {
  const deployStage = PIPELINE_STAGES.find(s => s.id === 'deploy-canary');
  assert.ok(deployStage, 'Deploy canary stage must be present');
  assert.equal(deployStage.phiEnvelope.intent, 'QA_VERDICT_PASS');
  assert.equal(deployStage.phiEnvelope.receipt.verdict, 'PASS');
  assert.equal(deployStage.phiEnvelope.receipt.checks.length, 5);
});

test('Next.js static export compliance', (t) => {
  // Ensure no server-side secrets or runtime dynamic variables leak in client bundle
  PIPELINE_STAGES.forEach((stage) => {
    const raw = JSON.stringify(stage);
    assert.ok(!raw.includes('process.env.SECRET'), 'Must not contain dynamic secret leaks');
    assert.ok(!raw.includes('eval('), 'Must not contain unsafe eval strings');
  });
});
