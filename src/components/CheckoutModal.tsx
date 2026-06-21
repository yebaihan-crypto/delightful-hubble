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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderPlaced: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Shipping & Sensory, 2: Payment, 3: Success
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    sensoryPackaging: 'fragrance_free', // 'standard' | 'fragrance_free' | 'silent'
  });
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const shippingFee = 0; // free worldwide shipping
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + shippingFee + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      shippingData.firstName &&
      shippingData.lastName &&
      shippingData.address &&
      shippingData.city &&
      shippingData.zipCode
    ) {
      setStep(2);
    } else {
      alert('Please fill out all required fields.');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      paymentData.cardNumber &&
      paymentData.expiry &&
      paymentData.cvv &&
      paymentData.nameOnCard
    ) {
      setStep(3);
    } else {
      alert('Please fill out all billing details.');
    }
  };

  const handleCloseSuccess = () => {
    onOrderPlaced(); // clear cart
    onClose();      // close modal
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="animate-fade-in">
        
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.stepIndicator}>
            <span style={{ 
              ...styles.stepDot, 
              backgroundColor: step >= 1 ? 'var(--color-text-primary)' : 'var(--color-border)' 
            }} />
            <span style={styles.stepLine} />
            <span style={{ 
              ...styles.stepDot, 
              backgroundColor: step >= 2 ? 'var(--color-text-primary)' : 'var(--color-border)' 
            }} />
            <span style={styles.stepLine} />
            <span style={{ 
              ...styles.stepDot, 
              backgroundColor: step === 3 ? 'var(--color-text-primary)' : 'var(--color-border)' 
            }} />
          </div>
          {step < 3 && (
            <button onClick={onClose} style={styles.closeBtn} aria-label="Cancel checkout">
              [ CANCEL ]
            </button>
          )}
        </div>

        {/* Step 1: Shipping & Sensory */}
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} style={styles.form}>
            <h3 style={styles.sectionTitle}>SENSORY SHIPPING DETAILS</h3>
            <p style={styles.sectionSub}>All packages are processed in a fragrance-free environment.</p>

            {/* Grid for Name */}
            <div style={styles.formGrid2}>
              <div>
                <label htmlFor="first-name">FIRST NAME *</label>
                <input 
                  id="first-name"
                  type="text" 
                  required 
                  value={shippingData.firstName}
                  onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="last-name">LAST NAME *</label>
                <input 
                  id="last-name"
                  type="text" 
                  required 
                  value={shippingData.lastName}
                  onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                />
              </div>
            </div>

            {/* Address */}
            <div style={styles.formGroup}>
              <label htmlFor="address">DELIVERY ADDRESS *</label>
              <input 
                id="address"
                type="text" 
                required 
                value={shippingData.address}
                onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
              />
            </div>

            {/* Grid for City / ZIP */}
            <div style={styles.formGrid2}>
              <div>
                <label htmlFor="city">CITY *</label>
                <input 
                  id="city"
                  type="text" 
                  required 
                  value={shippingData.city}
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="zip-code">ZIP CODE *</label>
                <input 
                  id="zip-code"
                  type="text" 
                  required 
                  value={shippingData.zipCode}
                  onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                />
              </div>
            </div>

            {/* Sensory Packaging Selection */}
            <div style={styles.sensoryBlock}>
              <label>SENSORY PACKAGING SPECIFICATION</label>
              
              <div style={styles.radioGroup}>
                {/* Option 1: Fragrance Free */}
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="sensoryPackaging" 
                    value="fragrance_free"
                    checked={shippingData.sensoryPackaging === 'fragrance_free'}
                    onChange={() => setShippingData({ ...shippingData, sensoryPackaging: 'fragrance_free' })}
                    style={styles.radioInput}
                  />
                  <div>
                    <span style={styles.radioTitle}>Pre-Washed & Fragrance-Free (Recommended)</span>
                    <span style={styles.radioDesc}>Coat is pre-washed in organic, hypoallergenic detergent. Shipped in non-dyed unbleached boxes.</span>
                  </div>
                </label>

                {/* Option 2: Silent Drop */}
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="sensoryPackaging" 
                    value="silent"
                    checked={shippingData.sensoryPackaging === 'silent'}
                    onChange={() => setShippingData({ ...shippingData, sensoryPackaging: 'silent' })}
                    style={styles.radioInput}
                  />
                  <div>
                    <span style={styles.radioTitle}>Silent Courier Drop</span>
                    <span style={styles.radioDesc}>Courier instructions: no doorbell, no knocking. Notification via digital text only to minimize sudden auditory shocks.</span>
                  </div>
                </label>

                {/* Option 3: Standard Minimalist */}
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="sensoryPackaging" 
                    value="standard"
                    checked={shippingData.sensoryPackaging === 'standard'}
                    onChange={() => setShippingData({ ...shippingData, sensoryPackaging: 'standard' })}
                    style={styles.radioInput}
                  />
                  <div>
                    <span style={styles.radioTitle}>Standard Unbranded</span>
                    <span style={styles.radioDesc}>Standard premium unbranded envelope, completely flat profile.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Checkout Pricing overview */}
            <div style={styles.summaryList}>
              <div style={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${subtotal}.00</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Est. Sensory Tax:</span>
                <span>${tax}.00</span>
              </div>
              <div style={{ ...styles.summaryRow, borderTop: '1px solid var(--color-border)', paddingTop: '8px', fontWeight: 600 }}>
                <span>Total:</span>
                <span>${total}.00</span>
              </div>
            </div>

            <button type="submit" className="btn-minimal" style={styles.submitBtn}>
              PROCEED TO TRANSACTION
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} style={styles.form}>
            <h3 style={styles.sectionTitle}>TRANSACTION GATEWAY</h3>
            <p style={styles.sectionSub}>Secure end-to-end tokenized billing.</p>

            <div style={styles.formGroup}>
              <label htmlFor="card-number">CARD NUMBER *</label>
              <input 
                id="card-number"
                type="text" 
                placeholder="4000 1234 5678 9010"
                required 
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
              />
            </div>

            <div style={styles.formGrid2}>
              <div>
                <label htmlFor="expiry">EXP DATE *</label>
                <input 
                  id="expiry"
                  type="text" 
                  placeholder="MM/YY" 
                  required 
                  value={paymentData.expiry}
                  onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="cvv">CVV *</label>
                <input 
                  id="cvv"
                  type="password" 
                  maxLength={4}
                  placeholder="•••" 
                  required 
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="cardholder-name">CARDHOLDER NAME *</label>
              <input 
                id="cardholder-name"
                type="text" 
                required 
                value={paymentData.nameOnCard}
                onChange={(e) => setPaymentData({ ...paymentData, nameOnCard: e.target.value })}
              />
            </div>

            {/* Total Display */}
            <div style={{ ...styles.summaryList, marginTop: '20px' }}>
              <div style={{ ...styles.summaryRow, fontWeight: 600 }}>
                <span>Final Charge:</span>
                <span>${total}.00 USD</span>
              </div>
            </div>

            <div style={styles.btnActionRow}>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={styles.backBtn}
              >
                [ GO BACK ]
              </button>
              
              <button 
                type="submit" 
                className="btn-minimal" 
                style={{ ...styles.submitBtn, flex: 1 }}
              >
                COMPLETE TRANSACTION
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <div style={styles.successScreen}>
            <div style={styles.checkmarkWrapper}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            
            <h3 style={styles.successTitle}>TRANSACTION COMPLETED</h3>
            <p style={styles.successDesc}>
              Order number <b>#BLANK-{(100000 + Math.random() * 900000).toFixed(0)}</b> has been securely processed.
            </p>

            <div style={styles.detailsBox}>
              <div style={styles.detailRow}>
                <span>RECIPIENT:</span>
                <span>{shippingData.firstName} {shippingData.lastName}</span>
              </div>
              <div style={styles.detailRow}>
                <span>ESTIMATED SHIPMENT:</span>
                <span>3 - 5 BUSINESS DAYS</span>
              </div>
              <div style={styles.detailRow}>
                <span>PACKAGING STYLE:</span>
                <span>
                  {shippingData.sensoryPackaging === 'fragrance_free' ? 'PRE-WASHED FRAGRANCE-FREE' : 
                   shippingData.sensoryPackaging === 'silent' ? 'SILENT DROP' : 'STANDARD UNBRANDED'}
                </span>
              </div>
            </div>

            <div style={styles.quoteBlock}>
              <p style={styles.quoteText}>
                “Clear the noise. Wear the focus.”
              </p>
              <span style={styles.quoteAuthor}>— BLANK. COGNITIVE INITIATION</span>
            </div>

            <button onClick={handleCloseSuccess} className="btn-minimal" style={styles.successCloseBtn}>
              RETURN TO MAIN SLATE
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(3px)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    width: '540px',
    maxWidth: '100%',
    backgroundColor: 'var(--color-bg-primary)',
    border: '1px solid var(--color-border)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 40px',
    borderBottom: '1px solid var(--color-border)',
    '@media (max-width: 768px)': {
      padding: '16px 24px',
    },
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'background-color var(--transition-normal)',
  },
  stepLine: {
    width: '40px',
    height: '1px',
    backgroundColor: 'var(--color-border)',
  },
  closeBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    color: 'var(--color-text-muted)',
    ':hover': {
      color: 'var(--color-text-primary)',
    },
  },
  form: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    '@media (max-width: 768px)': {
      padding: '24px',
    },
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    color: 'var(--color-text-primary)',
  },
  sectionSub: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
    marginTop: '-16px',
    marginBottom: '8px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  formGrid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  sensoryBlock: {
    marginTop: '10px',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginTop: '10px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-secondary)',
    cursor: 'pointer',
    transition: 'var(--transition-normal)',
  },
  radioInput: {
    width: '16px',
    height: '16px',
    marginTop: '3px',
    accentColor: 'var(--color-text-primary)',
    cursor: 'pointer',
  },
  radioTitle: {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  radioDesc: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
    lineHeight: 1.4,
  },
  summaryList: {
    backgroundColor: 'var(--color-bg-tertiary)',
    padding: '16px 20px',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    color: 'var(--color-text-primary)',
  },
  submitBtn: {
    marginTop: '10px',
    padding: '16px',
    fontWeight: 500,
  },
  btnActionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '10px',
  },
  backBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    color: 'var(--color-text-muted)',
    padding: '16px 8px',
  },
  successScreen: {
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    '@media (max-width: 768px)': {
      padding: '40px 24px',
    },
  },
  checkmarkWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    border: '1px solid var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  successTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    letterSpacing: '0.1em',
    fontWeight: 500,
    marginBottom: '10px',
  },
  successDesc: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '32px',
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '32px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-display)',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px',
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
  },
  quoteBlock: {
    margin: '0 0 40px',
  },
  quoteText: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.15rem',
    fontStyle: 'italic',
    color: 'var(--color-text-primary)',
  },
  quoteAuthor: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    color: 'var(--color-text-muted)',
    display: 'block',
    marginTop: '8px',
  },
  successCloseBtn: {
    width: '100%',
    padding: '16px',
  },
};
