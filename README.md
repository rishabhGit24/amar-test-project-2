# Amar's Pizzeria - Demo1

Frontend demo project built autonomously by AMAR agents.

## Pizzeria Landing Page

A fully accessible, responsive pizzeria landing page built with React 18, TypeScript, Tailwind CSS, and Zustand.

### Route

The pizzeria landing page is available at the `/pizzeria` route.

### How to Run

1. Install dependencies (first time only):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000/pizzeria
   ```

### How to Run Tests

```bash
npm test
```

All unit and integration tests are located in `src/pizzeria/test/` and use Vitest + React Testing Library.

### Cart Persistence

The shopping cart is persisted to `localStorage` under the key **`pizzeria-cart`** using Zustand's `persist` middleware. Cart contents survive page refreshes automatically.

### Accessibility

- All interactive elements have descriptive `aria-label` attributes.
- The cart button label updates dynamically (e.g. `"Open cart, 3 items"`).
- The cart panel (`<aside role="dialog" aria-modal="true">`) traps focus on open — the close button receives focus automatically.
- Pressing `Escape` while the cart is open closes the panel.
- Responsive layout at 375 px viewport width — no horizontal overflow.

### Production Build

```bash
npm run build
```

Produces a `dist/` directory with a single JS chunk (~56.79 KB gzipped), well under the 500 KB budget.
