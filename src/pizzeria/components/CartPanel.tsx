import { useEffect, useRef } from 'react';
import { useCartStore } from '../hooks/useCartStore';

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function CartPanel({ open, onClose }: CartPanelProps) {
  const items = useCartStore((state) => state.items);
  const grandTotal = useCartStore((state) => state.grandTotal);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Move focus to the close button when the panel opens (focus trap entry)
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  // Close panel on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Backdrop — only rendered when open */}
      {open && (
        <div
          className="pz-cart-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-out panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`pz-cart-panel${open ? ' pz-cart-panel--open' : ''}`}
      >
        {/* Header row */}
        <div className="pz-cart-panel__header">
          <h2>Your Cart</h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            className="pz-cart-panel__close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="pz-cart-panel__body">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {items.map((cartItem) => {
                const { menuItem, quantity } = cartItem;
                const subtotal = menuItem.price * quantity;

                return (
                  <li key={menuItem.id} className="pz-cart-panel__item">
                    <span className="pz-cart-panel__item-name">
                      {menuItem.name}
                    </span>

                    <div className="pz-cart-panel__qty-controls">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${menuItem.name}`}
                        onClick={() => removeItem(menuItem.id)}
                        className="pz-cart-panel__qty-btn"
                      >
                        −
                      </button>

                      <span className="pz-cart-panel__qty-value">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${menuItem.name}`}
                        onClick={() => addItem(menuItem)}
                        className="pz-cart-panel__qty-btn"
                      >
                        +
                      </button>
                    </div>

                    <span className="pz-cart-panel__item-subtotal">
                      ₹{subtotal}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer — sticky to bottom */}
        <div className="pz-cart-panel__footer">
          <p className="pz-cart-panel__total">Total: ₹{grandTotal}</p>
          <button
            type="button"
            aria-label="Clear cart"
            onClick={clearCart}
            className="pz-cart-panel__clear-btn"
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </>
  );
}
