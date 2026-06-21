import React from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  badge: string;
  image: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={styles.drawer} 
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Drawer Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>SHOPPING BAG</h3>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close bag">
            [ CLOSE ]
          </button>
        </div>

        {/* Drawer Body - Items List */}
        <div style={styles.body}>
          {cartItems.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>YOUR BAG IS EMPTY</p>
              <p style={styles.emptySub}>A blank slate starts here. Select a cut and size to begin.</p>
            </div>
          ) : (
            <div style={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  <div style={styles.itemImageWrapper}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={styles.itemImage}
                      onError={(e) => {
                        // fallback if assets fail to load
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="80" viewBox="0 0 60 80"><rect width="100%" height="100%" fill="%23f2f2f2"/></svg>';
                      }}
                    />
                  </div>
                  
                  <div style={styles.itemDetails}>
                    <div style={styles.itemNameRow}>
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemPrice}>${item.price}.00</span>
                    </div>

                    <div style={styles.itemMeta}>
                      <span>Size: <b>{item.size}</b></span>
                      <span>Color: <b>{item.color}</b></span>
                      {item.badge && <span>Badge: <b>"{item.badge}"</b></span>}
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.id)} 
                      style={styles.removeBtn}
                    >
                      [ REMOVE ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer - Total & Checkout */}
        {cartItems.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.subtotalRow}>
              <span style={styles.subtotalLabel}>SUBTOTAL</span>
              <span style={styles.subtotalVal}>${subtotal}.00 USD</span>
            </div>
            
            <p style={styles.taxNotice}>
              Shipping, taxes, and sensory packaging options calculated at checkout.
            </p>

            <button 
              onClick={onCheckout} 
              className="btn-minimal" 
              style={styles.checkoutBtn}
            >
              INITIATE TRANSACT
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(2px)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: '460px',
    maxWidth: '100%',
    height: '100%',
    backgroundColor: 'var(--color-bg-primary)',
    borderLeft: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '40px',
    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.05)',
    '@media (max-width: 768px)': {
      padding: '24px',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '24px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
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
  body: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px 0',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '60%',
    textAlign: 'center' as const,
  },
  emptyText: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
  },
  emptySub: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
    maxWidth: '240px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  cartItem: {
    display: 'flex',
    gap: '20px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '24px',
  },
  itemImageWrapper: {
    width: '70px',
    height: '90px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  itemNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  itemName: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
  },
  itemPrice: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  itemMeta: {
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    marginBottom: '12px',
  },
  removeBtn: {
    alignSelf: 'flex-start',
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
    color: 'var(--color-text-muted)',
    padding: 0,
    ':hover': {
      color: 'var(--color-error)',
    },
  },
  footer: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '24px',
  },
  subtotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  subtotalLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
  },
  subtotalVal: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.3rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  taxNotice: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.4,
    marginBottom: '24px',
  },
  checkoutBtn: {
    width: '100%',
    padding: '16px',
  },
};
