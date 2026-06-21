import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ScienceLab } from './components/ScienceLab';
import { SizingTool } from './components/SizingTool';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  badge: string;
  image: string;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect system preference and set initial theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('blank-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('blank-theme', nextTheme);
  };

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      // If item with exact same configurations exists, avoid duplicates
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderPlaced = () => {
    setCart([]); // Clear cart after successful transaction
  };

  return (
    <>
      {/* Navigation */}
      <Navigation
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main>
        
        {/* Section 1: Hero */}
        <section style={styles.heroSection}>
          <div className="container" style={styles.heroGrid}>
            <div style={styles.heroText}>
              <span style={styles.brandTitle}>BLANK.</span>
              <h1 style={styles.heroHeading}>
                Clear the noise.<br />
                Wear the focus.
              </h1>
              <p style={styles.heroDesc}>
                A premium, sensory-shielded white coat engineered to ground neurodivergent minds (ADHD/ASD). 
                Leveraging the clinical psychology of <strong>Enclothed Cognition (穿着认知)</strong> to reduce cognitive load, 
                dampen sensory noise, and anchor deep-work flow states.
              </p>
              <div style={styles.heroCtaGroup}>
                <a href="#sizing-tool" className="btn-minimal">Configure Shield</a>
                <a href="#science-lab" style={styles.heroSecondaryCta}>
                  [ View Research Validation ]
                </a>
              </div>
            </div>
            <div style={styles.heroImgWrapper} className="animate-fade-in">
              <img 
                src={`${import.meta.env.BASE_URL}assets/hero_coat.png`} 
                alt="BLANK. Focus Coat on hanger" 
                style={styles.heroImg}
              />
            </div>
          </div>
        </section>

        {/* Section 2: ADHD Sensory Specs Grid */}
        <section id="sensory-design" style={styles.specsSection}>
          <div className="container">
            <div style={styles.sectionHeader}>
              <span style={styles.sectionOverline}>Sensory Specification</span>
              <h2>Ergonomic Shielding for ADHD</h2>
              <p style={styles.sectionSubtitle}>
                Every seam, closure, and texture is calibrated to reduce sensory gating issues and prevent attention fatigue.
              </p>
            </div>

            <div style={styles.specsGrid}>
              
              <div style={styles.specCard}>
                <span style={styles.specNum}>01</span>
                <h3 style={styles.specTitle}>Proprioceptive Weight</h3>
                <p style={styles.specText}>
                  Crafted from 14oz organic cotton-hemp canvas. The deliberate, grounding weight acts like a micro-weighted blanket, supplying calming spatial awareness feedback.
                </p>
              </div>

              <div style={styles.specCard}>
                <span style={styles.specNum}>02</span>
                <h3 style={styles.specTitle}>Noiseless Magnetic Snaps</h3>
                <p style={styles.specText}>
                  Replaces traditional hard plastic buttons. Double-sided flat magnets secure the coat silently, preventing distracting clicking or rattling during motor movement.
                </p>
              </div>

              <div style={styles.specCard}>
                <span style={styles.specNum}>03</span>
                <h3 style={styles.specTitle}>Peripheral Blinders</h3>
                <p style={styles.specText}>
                  A structured, stand-up mock collar blocks up to 30% of peripheral movement from your field of vision, helping keep your sightline fixed directly onto your task.
                </p>
              </div>

              <div style={styles.specCard}>
                <span style={styles.specNum}>04</span>
                <h3 style={styles.specTitle}>EMF-Shielding Core</h3>
                <p style={styles.specText}>
                  An interior chest pocket lined with silver-nanofiber mesh. Safely slides your phone away, dampening magnetic radiations and completely blocking wireless alert signals.
                </p>
              </div>

              <div style={styles.specCard}>
                <span style={styles.specNum}>05</span>
                <h3 style={styles.specTitle}>Bamboo-Silk Lining</h3>
                <p style={styles.specText}>
                  The entire interior is lined with tagless, flat-locked bamboo-silk. Zero friction, zero scratching, and hypoallergenic cooling for hypersensitive skin.
                </p>
              </div>

              <div style={styles.specCard}>
                <span style={styles.specNum}>06</span>
                <h3 style={styles.specTitle}>Silent Fidget Core</h3>
                <p style={styles.specText}>
                  Deep front pockets house an integrated matte-silicone elastic loop. Allows quiet stimming and fidgeting directly inside your pockets without drawing visual attention.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Section 3: Interactive Science Simulator */}
        <ScienceLab />

        {/* Section 4: Brand Manifesto / Story */}
        <section style={styles.manifestoSection}>
          <div className="container" style={styles.manifestGrid}>
            <div style={styles.manifestImgWrapper}>
              <img 
                src={`${import.meta.env.BASE_URL}assets/model_lifestyle.png`} 
                alt="Minimalist workflow wearing BLANK.COAT" 
                style={styles.manifestImg}
              />
            </div>
            
            <div style={styles.manifestText}>
              <span style={styles.sectionOverline}>Brand Philosophy</span>
              <h2 style={styles.manifestTitle}>The Blank Slate</h2>
              <blockquote style={styles.manifestQuote}>
                “ADHD is not a deficit of attention. It is an abundance of it—where every frequency in the room competes for priority.”
              </blockquote>
              <p style={styles.manifestParagraph}>
                Traditional modern work environments bombard our nervous system. A single flashing notification or a scratchy clothing tag is enough to break a fragile flow state that took hours to build.
              </p>
              <p style={styles.manifestParagraph}>
                `BLANK.` was founded as a design experiment to construct physical boundaries. By slipping on the Focus Coat, you enter a psychological contract with your surroundings. It is a visual cue to colleagues that you are offline, and a neurological cue to yourself that you are locked in.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Customizer & Fit Finder */}
        <SizingTool onAddToCart={handleAddToCart} />

        {/* Section 6: Textile / Material Specs */}
        <section style={styles.fabricSection}>
          <div className="container" style={styles.fabricGrid}>
            <div style={styles.fabricText}>
              <span style={styles.sectionOverline}>Raw Sourcing</span>
              <h2>Natural Organic Weave</h2>
              <p style={styles.fabricDesc}>
                We source raw, long-staple organic cotton and coarse unbleached hemp fibers from sustainable family cooperatives. 
                The resulting blend is processed without harsh bleaching agents or chemical dyes, retaining its raw alabaster texture.
              </p>
              
              <ul style={styles.fabricSpecsList}>
                <li style={styles.fabricSpecItem}>
                  <span>Fiber Blend:</span>
                  <b>60% Long-Staple Cotton / 40% Raw Hemp Canvas</b>
                </li>
                <li style={styles.fabricSpecItem}>
                  <span>Textile Weight:</span>
                  <b>14.2 oz / Heavyweight Structural Canvas</b>
                </li>
                <li style={styles.fabricSpecItem}>
                  <span>Finishing:</span>
                  <b>Chamomile-steamed organic wash, completely fragrance-free</b>
                </li>
                <li style={styles.fabricSpecItem}>
                  <span>Stitching:</span>
                  <b>Flat-locked inner seams, 100% organic cotton thread</b>
                </li>
              </ul>
            </div>
            
            <div style={styles.fabricImgWrapper}>
              <img 
                src={`${import.meta.env.BASE_URL}assets/fabric_texture.png`} 
                alt="Close-up of unbleached cotton-hemp texture" 
                style={styles.fabricImg}
              />
              <span style={styles.fabricCaption}>Macro view of raw hemp slubs providing sensory-grounding tactile cues.</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerGrid}>
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>BLANK.</span>
            <p style={styles.footerTagline}>Cognitive shields for neurodivergent workflow.</p>
            <p style={styles.footerCopyright}>
              © 2026 BLANK. COGNITIVE WEAR. ALL RIGHTS RESERVED.
            </p>
          </div>

          <div style={styles.footerLinksGroup}>
            <div style={styles.footerLinkCol}>
              <span style={styles.footerColTitle}>COLLECTIONS</span>
              <a href="#sizing-tool" style={styles.footerLink}>01 - The Lab Coat</a>
              <a href="#sizing-tool" style={styles.footerLink}>02 - The Tech Shacket</a>
              <a href="#" style={styles.footerLink}>Sensory Blankets</a>
            </div>

            <div style={styles.footerLinkCol}>
              <span style={styles.footerColTitle}>RESEARCH</span>
              <a href="#science-lab" style={styles.footerLink}>Enclothed Cognition</a>
              <a href="#" style={styles.footerLink}>ADHD Sensory Gating</a>
              <a href="#" style={styles.footerLink}>Deep Pressure Therapy</a>
            </div>

            <div style={styles.footerLinkCol}>
              <span style={styles.footerColTitle}>CONTACT</span>
              <a href="#" style={styles.footerLink}>Sensory Exchanges</a>
              <a href="#" style={styles.footerLink}>Fragrance-Free Care</a>
              <a href="#" style={styles.footerLink}>Silent Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderPlaced={handleOrderPlaced}
      />
    </>
  );
}

const styles = {
  heroSection: {
    padding: '80px 0 120px',
    backgroundColor: 'var(--color-bg-primary)',
    borderBottom: '1px solid var(--color-border)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gap: '40px',
      textAlign: 'center' as const,
    },
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: 'var(--color-text-primary)',
    marginBottom: '16px',
  },
  heroHeading: {
    marginBottom: '24px',
  },
  heroDesc: {
    fontSize: '1.05rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
    marginBottom: '40px',
    maxWidth: '520px',
    '@media (max-width: 900px)': {
      margin: '0 auto 30px',
    },
  },
  heroCtaGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    '@media (max-width: 900px)': {
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },
  },
  heroSecondaryCta: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    color: 'var(--color-text-primary)',
    textTransform: 'uppercase' as const,
    opacity: 0.8,
    transition: 'opacity var(--transition-fast)',
    ':hover': {
      opacity: 1,
    },
  },
  heroImgWrapper: {
    border: '1px solid var(--color-border)',
    padding: '24px',
    backgroundColor: 'var(--color-bg-secondary)',
    transition: 'var(--transition-normal)',
  },
  heroImg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover' as const,
  },
  specsSection: {
    padding: '120px 0',
    backgroundColor: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-border)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  sectionHeader: {
    textAlign: 'center' as const,
    maxWidth: '650px',
    margin: '0 auto 80px',
  },
  sectionOverline: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '12px',
  },
  sectionSubtitle: {
    color: 'var(--color-text-secondary)',
    marginTop: '12px',
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
  },
  specCard: {
    padding: '40px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-primary)',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'var(--transition-normal)',
    ':hover': {
      borderColor: 'var(--color-border-hover)',
    },
  },
  specNum: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 300,
    color: 'var(--color-text-muted)',
    lineHeight: 1,
    marginBottom: '20px',
    opacity: 0.5,
  },
  specTitle: {
    fontSize: '1.25rem',
    fontWeight: 400,
    marginBottom: '12px',
  },
  specText: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  manifestoSection: {
    padding: '120px 0',
    backgroundColor: 'var(--color-bg-primary)',
    borderBottom: '1px solid var(--color-border)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  manifestGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    alignItems: 'center',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gap: '40px',
    },
  },
  manifestImgWrapper: {
    border: '1px solid var(--color-border)',
    padding: '24px',
    backgroundColor: 'var(--color-bg-secondary)',
  },
  manifestImg: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  manifestText: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  manifestTitle: {
    marginBottom: '24px',
  },
  manifestQuote: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.25rem',
    fontStyle: 'italic',
    lineHeight: 1.5,
    borderLeft: '2px solid var(--color-text-primary)',
    paddingLeft: '24px',
    margin: '24px 0',
    color: 'var(--color-text-primary)',
  },
  manifestParagraph: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: 'var(--color-text-secondary)',
    marginBottom: '20px',
  },
  fabricSection: {
    padding: '120px 0',
    backgroundColor: 'var(--color-bg-primary)',
    borderBottom: '1px solid var(--color-border)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  fabricGrid: {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '80px',
    alignItems: 'center',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gap: '40px',
    },
  },
  fabricText: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  fabricDesc: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: 'var(--color-text-secondary)',
    margin: '20px 0 32px',
  },
  fabricSpecsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  fabricSpecItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '12px',
    fontFamily: 'var(--font-display)',
    color: 'var(--color-text-primary)',
  },
  fabricImgWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    border: '1px solid var(--color-border)',
    padding: '20px',
    backgroundColor: 'var(--color-bg-secondary)',
  },
  fabricImg: {
    width: '100%',
    height: 'auto',
    maxHeight: '450px',
    objectFit: 'cover' as const,
  },
  fabricCaption: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.05em',
    textAlign: 'center' as const,
  },
  footer: {
    padding: '80px 0',
    backgroundColor: 'var(--color-bg-secondary)',
    borderTop: '1px solid var(--color-border)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  footerGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '40px',
  },
  footerBrand: {
    flex: '1 1 300px',
  },
  footerLogo: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 700,
    letterSpacing: '-0.04em',
    color: 'var(--color-text-primary)',
    display: 'block',
    marginBottom: '8px',
  },
  footerTagline: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '24px',
  },
  footerCopyright: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.05em',
  },
  footerLinksGroup: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '60px',
    '@media (max-width: 600px)': {
      gap: '40px',
    },
  },
  footerLinkCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  footerColTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
  },
  footerLink: {
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    transition: 'color var(--transition-fast)',
    ':hover': {
      color: 'var(--color-text-primary)',
    },
  },
};

export default App;
