import { useState, useEffect, useRef } from 'react';
import type { MenuItem, PizzaSize } from '../types';
import { SIZE_MULTIPLIERS } from '../types';
import { useCartStore } from '../hooks/useCartStore';

interface PizzaDetailModalProps {
  menuItem: MenuItem | null;
  onClose: () => void;
}

const SIZE_OPTIONS: PizzaSize[] = ['Small', 'Medium', 'Large'];

export default function PizzaDetailModal({ menuItem, onClose }: PizzaDetailModalProps) {
  const [size, setSize] = useState<PizzaSize>('Medium');
  const [quantity, setQuantity] = useState<number>(1);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset state when a new pizza is opened
  useEffect(() => {
    if (menuItem) {
      setSize('Medium');
      setQuantity(1);
    }
  }, [menuItem?.id]);

  // Escape key closes modal
  useEffect(() => {
    if (!menuItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuItem, onClose]);

  // Focus trap: focus first focusable element on mount, trap Tab/Shift+Tab
  useEffect(() => {
    if (!menuItem || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = (): HTMLElement[] =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
        (el) => !el.hasAttribute('disabled'),
      );

    // Focus the first focusable element (first size pill)
    const focusables = getFocusableElements();
    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if focus is on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if focus is on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [menuItem]);

  if (!menuItem) return null;

  const effectivePrice = Math.round(menuItem.price * SIZE_MULTIPLIERS[size]);

  const handleAddToCart = () => {
    const addItem = useCartStore.getState().addItem;
    for (let i = 0; i < quantity; i++) {
      addItem(menuItem, size, effectivePrice);
    }
    onClose();
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };

  return (
    <div
      role="presentation"
      className="pz-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pz-modal-title"
        className="pz-modal"
        onClick={handleDialogClick}
      >
        {/* Tag pill */}
        <div className="pz-modal__tag">
          <span className={`pz-card-tag pz-tag--${menuItem.tag}`}>
            {menuItem.tag === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        {/* Title */}
        <h2 id="pz-modal-title" className="pz-modal__title">
          {menuItem.name}
        </h2>

        {/* Description */}
        <p className="pz-modal__desc">{menuItem.description}</p>

        {/* Size selector */}
        <div className="pz-modal__size-selector" role="group" aria-label="Select size">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={size === option}
              className={`pz-modal__size-pill${size === option ? ' pz-modal__size-pill--selected' : ''}`}
              onClick={() => setSize(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Price display */}
        <p className="pz-modal__price" aria-live="polite" aria-atomic="true">
          ₹{effectivePrice}
        </p>

        {/* Quantity stepper */}
        <div className="pz-modal__stepper" role="group" aria-label="Quantity">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="pz-cart-panel__qty-btn"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="pz-cart-panel__qty-value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="pz-cart-panel__qty-btn"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>

        {/* Footer: Add to Cart */}
        <div className="pz-modal__footer">
          <button
            type="button"
            className="pz-btn-add pz-modal__add-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
