import React from 'react';

interface NavigationProps {
  cartCount: number;
  onCartClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  cartCount,
  onCartClick,
  theme,
  toggleTheme,
}) => {
  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        {/* Brand Logo */}
        <a href="/" style={styles.logo}>
          BLANK<span style={styles.dot}>.</span>
        </a>

        {/* Desktop Navigation */}
        <nav style={styles.nav}>
          <a href="#product-showcase" style={styles.navLink}>The Coat</a>
          <a href="#science-lab" style={styles.navLink}>The Science</a>
          <a href="#sensory-design" style={styles.navLink}>Sensory Details</a>
          <a href="#sizing-tool" style={styles.navLink}>Fit Finder</a>
        </nav>

        {/* Action Utilities */}
        <div style={styles.actions}>
          <button 
            onClick={toggleTheme} 
            style={styles.themeToggle}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <span style={styles.actionText}>[ DARK MODE ]</span>
            ) : (
              <span style={styles.actionText}>[ LIGHT MODE ]</span>
            )}
          </button>

          <button 
            onClick={onCartClick} 
            style={styles.cartButton}
            aria-label="View shopping bag"
          >
            <span style={styles.actionText}>BAG</span>
            <span style={styles.cartBadge}>{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    backgroundColor: 'var(--color-bg-primary)',
    borderBottom: '1px solid var(--color-border)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.6rem',
    fontWeight: 700,
    letterSpacing: '-0.04em',
    color: 'var(--color-text-primary)',
    textDecoration: 'none',
  },
  dot: {
    color: 'var(--color-text-muted)',
  },
  nav: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  navLink: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    fontWeight: 400,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: 'var(--color-text-primary)',
    transition: 'opacity var(--transition-fast)',
    opacity: 0.8,
    cursor: 'pointer',
    ':hover': {
      opacity: 1,
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  themeToggle: {
    padding: '4px 8px',
  },
  cartButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
  },
  actionText: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    fontWeight: 500,
    letterSpacing: '0.06em',
    color: 'var(--color-text-primary)',
  },
  cartBadge: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--color-bg-primary)',
    backgroundColor: 'var(--color-text-primary)',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-normal)',
  },
};
