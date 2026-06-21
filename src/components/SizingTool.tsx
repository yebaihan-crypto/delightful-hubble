import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  badge: string;
  image: string;
}

interface SizingToolProps {
  onAddToCart: (item: CartItem) => void;
}

export const SizingTool: React.FC<SizingToolProps> = ({ onAddToCart }) => {
  const [height, setHeight] = useState(175); // cm
  const [weight, setWeight] = useState(65);  // kg
  const [selectedProduct, setSelectedProduct] = useState('01_lab_coat'); // '01_lab_coat' | '02_tech_shacket'
  const [selectedColor, setSelectedColor] = useState('Alabaster White'); // 'Alabaster White' | 'Raw Linen'
  const [badgeText, setBadgeText] = useState('FOCUS');
  const [successMsg, setSuccessMsg] = useState(false);

  // Sizing Logic
  const getRecommendation = () => {
    if (height < 165 || (height < 170 && weight < 55)) {
      return {
        label: 'SIZE I',
        specs: 'Length: 98cm | Sleeve: 59cm | Chest: 112cm',
        fitDescription: 'Tailored drape. Ideal for heights under 165cm or slim profiles.',
      };
    } else if (height >= 165 && height < 177 && weight < 75) {
      return {
        label: 'SIZE II',
        specs: 'Length: 104cm | Sleeve: 62cm | Chest: 118cm',
        fitDescription: 'Standard relaxed fit. Perfect balance of length and sensory room.',
      };
    } else if (height >= 177 && height < 188 && weight < 90) {
      return {
        label: 'SIZE III',
        specs: 'Length: 110cm | Sleeve: 65cm | Chest: 124cm',
        fitDescription: 'Architectural silhouette. Designed for heights 177cm to 188cm.',
      };
    } else {
      return {
        label: 'SIZE IV',
        specs: 'Length: 116cm | Sleeve: 68cm | Chest: 130cm',
        fitDescription: 'Extended volume. For profiles over 188cm or seeking maximum drape.',
      };
    }
  };

  const recommendation = getRecommendation();
  const productPrice = selectedProduct === '01_lab_coat' ? 189 : 169;
  const productName = selectedProduct === '01_lab_coat' ? 'BLANK.COAT 01 - The Lab Coat' : 'BLANK.COAT 02 - The Tech Shacket';

  const handleAdd = () => {
    const item: CartItem = {
      id: `${selectedProduct}-${selectedColor}-${recommendation.label}-${badgeText}`,
      name: productName,
      price: productPrice,
      size: recommendation.label,
      color: selectedColor,
      badge: badgeText.toUpperCase(),
      image: `${import.meta.env.BASE_URL}assets/hero_coat.png`,
    };
    onAddToCart(item);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <section id="sizing-tool" className="section-spacing" style={styles.section}>
      <div className="container" style={styles.layoutGrid}>
        
        {/* Left Column: Interactive Fit Finder */}
        <div style={styles.interactivePanel}>
          <span style={styles.overline}>Fit Finder & Customizer</span>
          <h2 style={styles.title}>Configure Your Shield</h2>
          <p style={styles.description}>
            Enter your proportions. Our sensory garments are engineered with specific volume guidelines 
            to provide proprioceptive feedback without restricting cognitive workflow.
          </p>

          {/* Product Type Selector */}
          <div style={styles.selectorGroup}>
            <label>Select Cut</label>
            <div style={styles.productButtons}>
              <button 
                onClick={() => setSelectedProduct('01_lab_coat')}
                style={{
                  ...styles.selectorBtn,
                  borderColor: selectedProduct === '01_lab_coat' ? 'var(--color-text-primary)' : 'var(--color-border)',
                  fontWeight: selectedProduct === '01_lab_coat' ? 600 : 400,
                }}
              >
                01. Classic Lab Coat ($189)
              </button>
              <button 
                onClick={() => setSelectedProduct('02_tech_shacket')}
                style={{
                  ...styles.selectorBtn,
                  borderColor: selectedProduct === '02_tech_shacket' ? 'var(--color-text-primary)' : 'var(--color-border)',
                  fontWeight: selectedProduct === '02_tech_shacket' ? 600 : 400,
                }}
              >
                02. Technical Shacket ($169)
              </button>
            </div>
          </div>

          {/* Color Selector */}
          <div style={styles.selectorGroup}>
            <label>Colorway</label>
            <div style={styles.colorWrapper}>
              {['Alabaster White', 'Raw Linen'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    ...styles.colorDotBtn,
                    border: selectedColor === color ? '1px solid var(--color-text-primary)' : '1px solid transparent',
                  }}
                >
                  <span style={{
                    ...styles.colorDot,
                    backgroundColor: color === 'Alabaster White' ? '#FFFFFF' : '#E6DFD3',
                    border: '1px solid #E5E5E5',
                  }} />
                  <span style={styles.colorDotLabel}>{color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slider Inputs */}
          <div style={styles.sliderContainer}>
            <div style={styles.sliderHeader}>
              <span>Height</span>
              <span style={styles.sliderVal}>{height} cm</span>
            </div>
            <input 
              type="range" 
              min="150" 
              max="200" 
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              style={styles.slider}
            />

            <div style={{ ...styles.sliderHeader, marginTop: '24px' }}>
              <span>Weight</span>
              <span style={styles.sliderVal}>{weight} kg</span>
            </div>
            <input 
              type="range" 
              min="40" 
              max="120" 
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* Sizing Recommendation Display */}
          <div style={styles.recommendationBox}>
            <span style={styles.recLabel}>RECOMMENDED FIT</span>
            <div style={styles.recSize}>{recommendation.label}</div>
            <div style={styles.recSpecs}>{recommendation.specs}</div>
            <div style={styles.recDesc}>{recommendation.fitDescription}</div>
          </div>
        </div>

        {/* Right Column: Custom Focus Word & Add to Cart */}
        <div style={styles.previewPanel}>
          <div style={styles.embroideryCustomizer}>
            <label htmlFor="embroidery-input">Custom Focus Word (Subtle Embroidery)</label>
            <p style={styles.embroiderySub}>
              A tone-on-tone anchor stitched on the inner cuff. Visible only to you, serving as a tactile and visual focal point.
            </p>
            <input 
              id="embroidery-input"
              type="text" 
              value={badgeText} 
              onChange={(e) => setBadgeText(e.target.value.slice(0, 12))}
              placeholder="e.g. FLOW"
              style={styles.embroideryInput}
            />

            {/* Live Visual Preview */}
            <div style={styles.sleevePreview}>
              <div style={styles.sleeveFabric}>
                <div style={styles.cuffLine} />
                <div style={styles.embroideryText}>
                  {badgeText ? badgeText.toUpperCase() : '• • •'}
                </div>
              </div>
              <span style={styles.previewLabel}>INNER SLEEVE EMBROIDERY PREVIEW (SUBTLE TEXTURE)</span>
            </div>
          </div>

          {/* Add To Cart Trigger */}
          <div style={styles.buyBox}>
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>TOTAL</span>
              <span style={styles.priceValue}>${productPrice}.00 USD</span>
            </div>
            
            <button 
              onClick={handleAdd} 
              className="btn-minimal" 
              style={styles.addBtn}
            >
              {successMsg ? 'ADDED TO BAG' : 'ADD TO COGNITIVE SLATE'}
            </button>

            {successMsg && (
              <p style={styles.successToast}>
                ✓ Garment configured and added to your shopping bag.
              </p>
            )}

            <p style={styles.guaranteeText}>
              Free fragrance-free shipping worldwide. 30-day sensory-exchange guarantee.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-border)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '80px',
    alignItems: 'start',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
      gap: '50px',
    },
  },
  interactivePanel: {
    display: 'flex',
    flexDirection: 'column' as const,
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
  description: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.95rem',
    marginBottom: '32px',
  },
  selectorGroup: {
    marginBottom: '24px',
  },
  productButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
    flexWrap: 'wrap' as const,
  },
  selectorBtn: {
    flex: 1,
    minWidth: '200px',
    padding: '14px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    textAlign: 'left' as const,
    transition: 'var(--transition-normal)',
  },
  colorWrapper: {
    display: 'flex',
    gap: '24px',
    marginTop: '8px',
  },
  colorDotBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: 'var(--color-bg-primary)',
    transition: 'var(--transition-fast)',
  },
  colorDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  colorDotLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    color: 'var(--color-text-primary)',
  },
  sliderContainer: {
    margin: '32px 0',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
  },
  sliderVal: {
    fontWeight: 600,
  },
  slider: {
    WebkitAppearance: 'none' as const,
    width: '100%',
    height: '2px',
    background: 'var(--color-border)',
    outline: 'none',
    margin: '8px 0',
  },
  recommendationBox: {
    padding: '24px',
    backgroundColor: 'var(--color-bg-primary)',
    border: '1px solid var(--color-border)',
    marginTop: '20px',
  },
  recLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '8px',
  },
  recSize: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: 1.1,
  },
  recSpecs: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    margin: '4px 0 12px',
  },
  recDesc: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  previewPanel: {
    border: '1px solid var(--color-border)',
    padding: '40px',
    backgroundColor: 'var(--color-bg-primary)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '30px',
    '@media (max-width: 768px)': {
      padding: '24px',
    },
  },
  embroideryCustomizer: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  embroiderySub: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '16px',
  },
  embroideryInput: {
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
  },
  sleevePreview: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  sleeveFabric: {
    width: '100%',
    height: '140px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '25px',
    overflow: 'hidden',
  },
  cuffLine: {
    position: 'absolute' as const,
    bottom: '15px',
    left: 0,
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--color-border)',
  },
  embroideryText: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.25em',
    color: 'var(--color-text-muted)',
    opacity: 0.6,
    textShadow: '1px 1px 0px rgba(255,255,255,0.7)',
  },
  previewLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.6rem',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.05em',
  },
  buyBox: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '24px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  priceLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
  },
  priceValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.6rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  addBtn: {
    width: '100%',
    padding: '16px',
    fontWeight: 500,
  },
  successToast: {
    fontSize: '0.85rem',
    color: '#34C759',
    marginTop: '12px',
    textAlign: 'center' as const,
    fontFamily: 'var(--font-display)',
  },
  guaranteeText: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    textAlign: 'center' as const,
    marginTop: '16px',
    lineHeight: 1.4,
  },
};
