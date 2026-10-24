// pages/index.js - Action Lab // Shipyard
// Interactive GitHub Actions Workflow Explorer & Sovereign Agent Gate
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Shipyard.module.css';
import { PIPELINE_STAGES, WORKFLOW_METRICS } from '@/lib/pipelineData';

export default function Home() {
  const [selectedStageId, setSelectedStageId] = useState('checkout-mandate');
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'yaml' | 'phi'
  const [simRunning, setSimRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1); // 1, 2, 5
  const [simElapsed, setSimElapsed] = useState(0);
  const [stageProgress, setStageProgress] = useState({
    'checkout-mandate': 'idle',
    'setup-runtime': 'idle',
    'lint-test': 'idle',
    'static-build': 'idle',
    'deploy-canary': 'idle',
  });
  const [tapApproved, setTapApproved] = useState(false);

  const activeStage = PIPELINE_STAGES.find((s) => s.id === selectedStageId) || PIPELINE_STAGES[0];
  const timerRef = useRef(null);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setSimRunning((prev) => !prev);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetSimulation();
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].includes(e.code)) {
        const idx = parseInt(e.code.replace('Digit', ''), 10) - 1;
        if (PIPELINE_STAGES[idx]) {
          setSelectedStageId(PIPELINE_STAGES[idx].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulation execution loop
  useEffect(() => {
    if (!simRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = Math.max(100, Math.floor(250 / simSpeed));
    timerRef.current = setInterval(() => {
      setSimElapsed((prev) => {
        const nextTime = Math.round((prev + 0.25 * simSpeed) * 10) / 10;

        // Calculate stage boundaries
        let accumulated = 0;
        let currentActiveId = PIPELINE_STAGES[0].id;
        const newProgress = {};

        for (let i = 0; i < PIPELINE_STAGES.length; i++) {
          const s = PIPELINE_STAGES[i];
          const stageEnd = accumulated + s.durationSec;
          if (nextTime < accumulated) {
            newProgress[s.id] = 'idle';
          } else if (nextTime >= accumulated && nextTime < stageEnd) {
            newProgress[s.id] = 'running';
            currentActiveId = s.id;
          } else {
            newProgress[s.id] = 'success';
          }
          accumulated = stageEnd;
        }

        setStageProgress(newProgress);
        setSelectedStageId(currentActiveId);

        if (nextTime >= WORKFLOW_METRICS.totalExecutionSec) {
          setSimRunning(false);
          const completedProgress = {};
          PIPELINE_STAGES.forEach((s) => (completedProgress[s.id] = 'success'));
          setStageProgress(completedProgress);
          setSelectedStageId('deploy-canary');
          return WORKFLOW_METRICS.totalExecutionSec;
        }
        return nextTime;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simRunning, simSpeed]);

  const resetSimulation = () => {
    setSimRunning(false);
    setSimElapsed(0);
    const resetProgress = {};
    PIPELINE_STAGES.forEach((s) => (resetProgress[s.id] = 'idle'));
    setStageProgress(resetProgress);
    setSelectedStageId('checkout-mandate');
  };

  const handleStepForward = () => {
    const currentIdx = PIPELINE_STAGES.findIndex((s) => s.id === selectedStageId);
    const nextIdx = (currentIdx + 1) % PIPELINE_STAGES.length;
    setSelectedStageId(PIPELINE_STAGES[nextIdx].id);
  };

  const handleTapGate = () => {
    setTapApproved(true);
  };

  return (
    <>
      <Head>
        <title>Action Lab // Shipyard — GitHub Actions Workflow Explorer</title>
        <meta
          name="description"
          content="Interactive GitHub Actions Workflow Explorer and Protocol Phi Sovereign Agent Gate"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        {/* Header Bar */}
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <span className={styles.logoBadge}>SHIPYARD</span>
            <div>
              <h1 className={styles.mainTitle}>Action Lab // Workflow Explorer</h1>
              <p className={styles.subtitle}>
                Essentials of Automated Deployment &bull; Protocol Phi (&Phi;-0.1) Zero-Trust Gate
              </p>
            </div>
          </div>

          <div className={styles.headerBadges}>
            <span className={`${styles.pillBadge} ${simRunning ? styles.pillRunning : styles.pillActive}`}>
              {simRunning ? 'Workflow: Running' : simElapsed > 0 ? 'Workflow: Complete' : 'Workflow: Ready'}
            </span>
            <span className={styles.pillBadge}>Runner: ubuntu-latest</span>
            <span className={styles.pillBadge}>Target: GitHub Pages</span>
            <span className={styles.pillBadge}>Branch: minutta/min-200</span>
          </div>
        </header>

        {/* Stepper Pipeline Bar */}
        <section className={styles.stepperSection} aria-label="Workflow Pipeline Stepper">
          <div className={styles.stepperContainer}>
            {PIPELINE_STAGES.map((stage, idx) => {
              const status = stageProgress[stage.id];
              const isSelected = selectedStageId === stage.id;
              const isSuccess = status === 'success';
              const isRunning = status === 'running';

              return (
                <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <button
                    type="button"
                    className={`${styles.stepNode} ${isSuccess ? styles.stepSuccess : ''} ${
                      isSelected || isRunning ? styles.stepActive : ''
                    }`}
                    onClick={() => setSelectedStageId(stage.id)}
                    aria-label={`Select stage ${stage.name}`}
                  >
                    <div className={styles.stepCircle}>
                      {isSuccess ? '✓' : isRunning ? '⚡' : idx + 1}
                    </div>
                    <span className={styles.stepLabel}>{stage.shortName}</span>
                    <span className={styles.stepStatusTag}>
                      {isRunning ? 'Running...' : isSuccess ? 'Passed' : `${stage.durationSec}s`}
                    </span>
                  </button>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <div
                      className={`${styles.connectingLine} ${
                        stageProgress[PIPELINE_STAGES[idx + 1].id] !== 'idle'
                          ? styles.connectingActive
                          : ''
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Controls Bar */}
          <div className={styles.controlsBar}>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setSimRunning(!simRunning)}
              >
                {simRunning ? '⏸ Pause Simulation' : '▶ Run Pipeline Replay'}
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={handleStepForward}
              >
                ⏭ Step Stage
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={resetSimulation}
              >
                ↺ Reset
              </button>
            </div>

            <div className={styles.buttonGroup}>
              <div className={styles.speedSelector} role="radiogroup" aria-label="Simulation Speed">
                {[1, 2, 5].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    className={`${styles.speedBtn} ${simSpeed === spd ? styles.speedBtnActive : ''}`}
                    onClick={() => setSimSpeed(spd)}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <div className={styles.timerDisplay}>
                T+ {simElapsed.toFixed(1)}s / {WORKFLOW_METRICS.totalExecutionSec}s
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <main className={styles.mainLayout}>
          {/* Stage Inspector (Left Pane) */}
          <section className={styles.stageCard} aria-labelledby="stage-inspector-heading">
            <div className={styles.stageCardHeader}>
              <div>
                <h2 id="stage-inspector-heading" className={styles.stageCardTitle}>
                  {activeStage.name}
                </h2>
                <p className={styles.stageCardDesc}>{activeStage.description}</p>
              </div>
              <span className={styles.pillBadge}>{activeStage.badge}</span>
            </div>

            {/* View Tabs */}
            <div className={styles.tabsBar} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'terminal'}
                className={`${styles.tabItem} ${activeTab === 'terminal' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('terminal')}
              >
                Terminal Output ($ stdout)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'yaml'}
                className={`${styles.tabItem} ${activeTab === 'yaml' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('yaml')}
              >
                Actions YAML Step
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'phi'}
                className={`${styles.tabItem} ${activeTab === 'phi' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('phi')}
              >
                Protocol Phi Envelope (&Phi;-0.1)
              </button>
            </div>

            {/* Tab Panes */}
            {activeTab === 'terminal' && (
              <div className={styles.terminalView} role="region" aria-label="Terminal log output">
                {activeStage.logs.map((log, lIdx) => (
                  <div key={lIdx} className={styles.logLine}>
                    <span className={styles.logTime}>[{log.time}]</span>
                    <span className={styles.logText}>{log.text}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'yaml' && (
              <pre className={styles.yamlView} role="region" aria-label="Actions YAML code">
                <code>{activeStage.yamlSnippet}</code>
              </pre>
            )}

            {activeTab === 'phi' && (
              <pre className={styles.phiView} role="region" aria-label="Protocol Phi Envelope JSON">
                <code>{JSON.stringify(activeStage.phiEnvelope, null, 2)}</code>
              </pre>
            )}
          </section>

          {/* Telemetry & Sovereign Gate Sidebar (Right Pane) */}
          <aside className={styles.sidebar}>
            {/* Live Metrics Card */}
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>
                Pipeline Telemetry
                <span className={styles.pillActive}>VERIFIED</span>
              </h3>
              <div className={styles.metricGrid}>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>Total Wall-Clock</div>
                  <div className={styles.metricValue}>{WORKFLOW_METRICS.totalExecutionSec}s</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>Static Bundle</div>
                  <div className={styles.metricValue}>{WORKFLOW_METRICS.bundleSizeKb} kB</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>Guardrail Audit</div>
                  <div className={styles.metricValue} style={{ color: '#34d399' }}>
                    100% PASS
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>Protocol Phi</div>
                  <div className={styles.metricValue} style={{ color: '#38bdf8' }}>
                    &Phi;-0.1 OK
                  </div>
                </div>
              </div>
            </div>

            {/* Guardrails Verification Checklist */}
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Guardrails &amp; Constraints</h3>
              <ul className={styles.checklist}>
                <li className={styles.checkItem}>
                  <span className={styles.checkIcon}>✔</span>
                  <span><strong>Public-Zone Only:</strong> Strictly verified public repositories &amp; open boundaries.</span>
                </li>
                <li className={styles.checkItem}>
                  <span className={styles.checkIcon}>✔</span>
                  <span><strong>Zero Outbound Leak:</strong> PRs, issues, stars, posts remain pure drafts.</span>
                </li>
                <li className={styles.checkItem}>
                  <span className={styles.checkIcon}>✔</span>
                  <span><strong>Evidence Bundle:</strong> Full receipts, test logs, and reproducible checkout coordinates.</span>
                </li>
                <li className={styles.checkItem}>
                  <span className={styles.checkIcon}>✔</span>
                  <span><strong>Accessible UX:</strong> Keyboard shortcuts (Space/1-5/R), WCAG AAA contrast, reduced motion.</span>
                </li>
              </ul>
            </div>

            {/* Sovereign 1-Tap Gate Simulator */}
            <div className={styles.gateCard}>
              <h3 className={styles.gateTitle}>
                <span>🛡 Sovereign Gatekeeper</span>
              </h3>
              <p className={styles.gateDesc}>
                Per Mindrock Constitution (AGENTS.md &sect;4&ndash;5), autonomous agents produce
                evidence; only Principal Pavel Cherkashin executes the final 1-tap canary release.
              </p>
              <button
                type="button"
                className={`${styles.btnTapGate} ${tapApproved ? styles.btnTapApproved : ''}`}
                onClick={handleTapGate}
                disabled={tapApproved}
              >
                {tapApproved ? '✓ 1-Tap Sovereign Approval Recorded' : '👆 1-Tap Approval (Principal Gate)'}
              </button>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <span>Mindrock Fleet Synthesis: </span>
            <code>codex@cloud</code> (Concept) &bull; <code>agy@wolfram</code> (Build &amp; QA) &bull;{' '}
            <a
              href="https://linear.app/mindrock/issue/MIN-200"
              target="_blank"
              rel="noreferrer"
            >
              Linear MIN-200
            </a>
          </div>
          <div>Nightathon Ritual &bull; 2026-10-24</div>
        </footer>
      </div>
    </>
  );
}
