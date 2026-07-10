import { useCartStore } from '../hooks/useCartStore';

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
}

function CartPanel({ open, onClose }: CartPanelProps) {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const grandTotal = useCartStore((state) => state.grandTotal);

  return (
    <>
      {open && (
        <div className="pz-cart-backdrop" onClick={onClose} />
      )}

      <aside className={`pz-cart-panel${open ? ' pz-cart-panel--open' : ''}`}>
        {/* Header */}
        <div className="pz-cart-panel__header">
          <h2>Your Cart</h2>
          <button
            className="pz-cart-panel__close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="pz-cart-panel__body">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="pz-cart-list">
              {items.map(({ menuItem, quantity }) => (
                <li key={menuItem.id} className="pz-cart-item">
                  <span className="pz-cart-item__name">{menuItem.name}</span>

                  <div className="pz-cart-item__controls">
                    <button
                      className="pz-cart-qty-btn"
                      onClick={() => removeItem(menuItem.id)}
                      aria-label={`Decrease quantity of ${menuItem.name}`}
                    >
                      −
                    </button>
                    <span className="pz-cart-item__qty">{quantity}</span>
                    <button
                      className="pz-cart-qty-btn"
                      onClick={() => addItem(menuItem)}
                      aria-label={`Increase quantity of ${menuItem.name}`}
                    >
                      +
                    </button>
                  </div>

                  <span className="pz-cart-item__subtotal">
                    ₹{menuItem.price * quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="pz-cart-panel__footer">
          <span className="pz-cart-total">Total: ₹{grandTotal}</span>
          <button
            className="pz-btn-clear"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </>
  );
}

export default CartPanel;
