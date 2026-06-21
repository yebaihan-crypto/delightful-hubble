import React, { useState, useEffect, useRef } from 'react';

interface Distraction {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface Target {
  id: number;
  letter: string;
  x: number;
  y: number;
  active: boolean;
}

export const ScienceLab: React.FC = () => {
  const [wearingCoat, setWearingCoat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ focus: 0, error: 0 });
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const distractionPool = [
    'Social Feed', 'Incoming Call', 'Anxiety', 'Unread Emails', 'Noise', 
    'Daydreaming', 'Slack Alert', 'Unfinished Task', 'Room Temp', 'Random Idea'
  ];
  const targetLetters = ['F', 'O', 'C', 'U', 'S'];

  // Initialize Game elements
  const initGame = () => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    
    // Create distractions
    const initialDistractions: Distraction[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      text: distractionPool[i % distractionPool.length],
      x: Math.random() * (rect.width - 150) + 50,
      y: Math.random() * (rect.height - 100) + 50,
      vx: (Math.random() - 0.5) * (wearingCoat ? 0.8 : 3.5),
      vy: (Math.random() - 0.5) * (wearingCoat ? 0.8 : 3.5),
      size: Math.random() * 20 + 70,
    }));

    // Create target
    const initialTargets: Target[] = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      letter: targetLetters[Math.floor(Math.random() * targetLetters.length)],
      x: Math.random() * (rect.width - 100) + 50,
      y: Math.random() * (rect.height - 100) + 50,
      active: true,
    }));

    setDistractions(initialDistractions);
    setTargets(initialTargets);
    setScore({ focus: 0, error: 0 });
  };

  // Start / Stop game
  const startGame = () => {
    setIsPlaying(true);
    initGame();
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore({ focus: 0, error: 0 });
    setDistractions([]);
    setTargets([]);
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const updatePhysics = () => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();

      // Update distractions
      setDistractions((prev) =>
        prev.map((d) => {
          let nx = d.x + d.vx * (wearingCoat ? 0.2 : 1.2);
          let ny = d.y + d.vy * (wearingCoat ? 0.2 : 1.2);
          let nvx = d.vx;
          let nvy = d.vy;

          // Boundary bounce
          if (nx <= 10 || nx >= rect.width - 120) nvx = -nvx;
          if (ny <= 10 || ny >= rect.height - 50) nvy = -nvy;

          return { ...d, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );

      animationFrameId.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameId.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying, wearingCoat]);

  // Handle Target click
  const handleTargetClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setScore((prev) => ({ ...prev, focus: prev.focus + 1 }));
    
    // Spawn new target at random position
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    
    setTargets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              letter: targetLetters[Math.floor(Math.random() * targetLetters.length)],
              x: Math.random() * (rect.width - 100) + 50,
              y: Math.random() * (rect.height - 100) + 50,
            }
          : t
      )
    );
  };

  // Handle Distraction/Mis-click
  const handleGameAreaClick = () => {
    if (!isPlaying) return;
    setScore((prev) => ({ ...prev, error: prev.error + 1 }));
  };

  const handleDistractionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScore((prev) => ({ ...prev, error: prev.error + 1.5 })); // higher penalty
  };

  const calculateFocusRatio = () => {
    const total = score.focus + score.error;
    if (total === 0) return 0;
    return Math.round((score.focus / total) * 100);
  };

  return (
    <section id="science-lab" className="section-spacing" style={styles.section}>
      <div className="container">
        <div style={styles.header}>
          <span style={styles.overline}>Scientific Validation</span>
          <h2 style={styles.title}>The Cognitive Simulator</h2>
          <p style={styles.subtitle}>
            Experience how the phenomenon of <strong>Enclothed Cognition (穿着认知)</strong> alters neural processing. 
            Test your selective attention below: click targets while ignoring floating sensory clutter.
          </p>
        </div>

        <div style={styles.experimentContainer}>
          {/* Simulator Panel */}
          <div style={styles.simPanel}>
            <div style={styles.panelHeader}>
              <div style={styles.statusIndicator}>
                <span style={{
                  ...styles.statusDot, 
                  backgroundColor: isPlaying ? '#34C759' : 'var(--color-text-muted)'
                }} />
                <span style={styles.statusText}>
                  {isPlaying ? 'SIMULATION IN PROGRESS' : 'SYSTEM IDLE'}
                </span>
              </div>
              <div style={styles.toggleWrapper}>
                <span style={{
                  ...styles.toggleLabel, 
                  color: wearingCoat ? 'var(--color-text-muted)' : 'var(--color-text-primary)'
                }}>NORMAL WEAR</span>
                
                <button 
                  onClick={() => setWearingCoat(!wearingCoat)} 
                  style={{
                    ...styles.toggleBtn,
                    backgroundColor: wearingCoat ? 'var(--color-text-primary)' : 'transparent',
                    borderColor: 'var(--color-text-primary)',
                  }}
                  aria-label="Toggle Focus Coat"
                >
                  <div style={{
                    ...styles.toggleKnob,
                    transform: wearingCoat ? 'translateX(24px)' : 'translateX(0px)',
                    backgroundColor: wearingCoat ? 'var(--color-bg-primary)' : 'var(--color-text-primary)',
                  }} />
                </button>

                <span style={{
                  ...styles.toggleLabel, 
                  color: wearingCoat ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  fontWeight: wearingCoat ? 600 : 400
                }}>BLANK.COAT ON</span>
              </div>
            </div>

            {/* Simulated Game Field */}
            <div 
              ref={gameAreaRef} 
              onClick={handleGameAreaClick}
              style={{
                ...styles.gameField,
                cursor: isPlaying ? 'crosshair' : 'default',
                borderColor: wearingCoat ? 'var(--color-text-primary)' : 'var(--color-border)',
                backgroundColor: wearingCoat ? 'var(--color-bg-secondary)' : 'var(--color-bg-primary)',
              }}
            >
              {/* Field Grid Overlay for Tech Look */}
              <div style={styles.gridOverlay} />

              {/* Shading/Vignette Effect in Focus Mode */}
              {wearingCoat && <div style={styles.vignetteOverlay} />}

              {!isPlaying ? (
                <div style={styles.startOverlay}>
                  <p style={styles.startTitle}>SELECTIVE ATTENTION TEST</p>
                  <p style={styles.startDesc}>
                    Click the floating bold letters (<b>F, O, C, U, S</b>). Ignore the chaotic gray distraction words. 
                    Toggle "BLANK.COAT" to see the difference in cognitive load.
                  </p>
                  <button onClick={startGame} className="btn-minimal" style={styles.playBtn}>
                    Initialize Lab Test
                  </button>
                </div>
              ) : (
                <>
                  {/* Floating Distractions */}
                  {distractions.map((d) => (
                    <div
                      key={d.id}
                      onClick={handleDistractionClick}
                      style={{
                        ...styles.distractionItem,
                        left: `${d.x}px`,
                        top: `${d.y}px`,
                        opacity: wearingCoat ? 0.08 : 0.45,
                        filter: wearingCoat ? 'blur(1px)' : 'none',
                        transition: 'opacity 0.6s ease, filter 0.6s ease',
                      }}
                    >
                      {d.text}
                    </div>
                  ))}

                  {/* Active Targets */}
                  {targets.map((t) => (
                    <button
                      key={t.id}
                      onClick={(e) => handleTargetClick(t.id, e)}
                      style={{
                        ...styles.targetNode,
                        left: `${t.x}px`,
                        top: `${t.y}px`,
                        transform: wearingCoat ? 'scale(1.15)' : 'scale(1.0)',
                        boxShadow: wearingCoat ? '0 0 15px rgba(0, 0, 0, 0.05)' : 'none',
                      }}
                    >
                      {t.letter}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Performance Stats */}
            <div style={styles.statsBar}>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>FOCUS INDEX</span>
                <span style={styles.statValue}>{calculateFocusRatio()}%</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>TARGETS HIT</span>
                <span style={styles.statValue}>{score.focus}</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>ERRORS</span>
                <span style={styles.statValue}>{Math.floor(score.error)}</span>
              </div>
              {isPlaying && (
                <button onClick={resetGame} style={styles.resetBtn}>
                  [ END TEST ]
                </button>
              )}
            </div>
          </div>

          {/* Research Insight Panel */}
          <div style={styles.researchPanel}>
            <span style={styles.panelOverline}>Psychological Mechanism</span>
            <h3 style={styles.panelTitle}>Enclothed Cognition</h3>
            
            <p style={styles.researchParagraph}>
              In a landmark study published in the <i>Journal of Experimental Social Psychology</i>, 
              researchers ran attention tests on subjects split into two groups. One wore their ordinary clothes, 
              while the other wore a doctor's/scientist's lab coat.
            </p>

            <div style={styles.chartWrapper}>
              <div style={styles.chartTitle}>SELECTIVE ATTENTION ERROR RATE (%)</div>
              
              <div style={styles.chartRow}>
                <span style={styles.chartRowLabel}>Street Clothes</span>
                <div style={styles.barContainer}>
                  <div style={{ ...styles.bar, width: '70%', backgroundColor: 'var(--color-text-muted)' }} />
                  <span style={styles.barVal}>18.5%</span>
                </div>
              </div>

              <div style={styles.chartRow}>
                <span style={styles.chartRowLabel}>BLANK.COAT Wear</span>
                <div style={styles.barContainer}>
                  <div style={{ ...styles.bar, width: '35%', backgroundColor: 'var(--color-text-primary)' }} />
                  <span style={{ ...styles.barVal, fontWeight: 600 }}>9.2%</span>
                </div>
              </div>
            </div>

            <blockquote style={styles.quote}>
              “The influence of clothes depends on both their symbolic meaning and the physical experience of wearing them.”
            </blockquote>

            <p style={styles.researchParagraph}>
              The coat isn't just fabric; it's a <strong>cognitive schema</strong> of precision, rigor, and silence. 
              When worn, it grounds your ADHD sensory triggers, signaling your brain to filter external stimuli.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--color-bg-primary)',
    borderTop: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  header: {
    textAlign: 'center' as const,
    maxWidth: '750px',
    margin: '0 auto 60px',
  },
  overline: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '12px',
  },
  title: {
    marginBottom: '20px',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
  },
  experimentContainer: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '60px',
    alignItems: 'start',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
      gap: '40px',
    },
  },
  simPanel: {
    display: 'flex',
    flexDirection: 'column' as const,
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-secondary)',
    transition: 'var(--transition-normal)',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease',
  },
  statusText: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'var(--color-text-primary)',
  },
  toggleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  toggleLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
    transition: 'color var(--transition-fast)',
  },
  toggleBtn: {
    width: '48px',
    height: '24px',
    borderRadius: '12px',
    border: '1px solid',
    position: 'relative' as const,
    padding: 0,
  },
  toggleKnob: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    transition: 'transform var(--transition-normal)',
  },
  gameField: {
    height: '380px',
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'background-color var(--transition-smooth), border-color var(--transition-smooth)',
  },
  gridOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    opacity: 0.15,
    pointerEvents: 'none' as const,
  },
  vignetteOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.1)',
    pointerEvents: 'none' as const,
    transition: 'opacity 0.6s ease',
  },
  startOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-bg-secondary)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center' as const,
    zIndex: 10,
  },
  startTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    fontWeight: 500,
    letterSpacing: '0.15em',
    color: 'var(--color-text-primary)',
    marginBottom: '12px',
  },
  startDesc: {
    maxWidth: '450px',
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '24px',
    lineHeight: 1.6,
  },
  playBtn: {
    padding: '10px 24px',
    fontSize: '0.8rem',
  },
  distractionItem: {
    position: 'absolute' as const,
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    fontWeight: 400,
    color: 'var(--color-text-muted)',
    pointerEvents: 'none' as const,
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
  },
  targetNode: {
    position: 'absolute' as const,
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '1px solid var(--color-text-primary)',
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform var(--transition-normal), background-color var(--transition-fast)',
    zIndex: 5,
    ':hover': {
      backgroundColor: 'var(--color-text-primary)',
      color: 'var(--color-bg-secondary)',
    },
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-tertiary)',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  statLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  resetBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    color: 'var(--color-error)',
  },
  researchPanel: {
    padding: '40px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-secondary)',
    '@media (max-width: 768px)': {
      padding: '24px',
    },
  },
  panelOverline: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '8px',
  },
  panelTitle: {
    fontSize: '1.8rem',
    fontWeight: 400,
    marginBottom: '20px',
  },
  researchParagraph: {
    fontSize: '0.9rem',
    lineHeight: 1.7,
    marginBottom: '20px',
    color: 'var(--color-text-secondary)',
  },
  chartWrapper: {
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  chartTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
    marginBottom: '4px',
  },
  chartRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  chartRowLabel: {
    width: '100px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    color: 'var(--color-text-primary)',
  },
  barContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    height: '24px',
  },
  bar: {
    height: '100%',
    transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  barVal: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    color: 'var(--color-text-primary)',
  },
  quote: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.05rem',
    fontStyle: 'italic',
    lineHeight: 1.5,
    borderLeft: '2px solid var(--color-text-primary)',
    paddingLeft: '20px',
    margin: '30px 0',
    color: 'var(--color-text-primary)',
  },
};
