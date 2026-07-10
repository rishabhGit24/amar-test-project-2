export default function HeroSection() {
  const handleOrderNow = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="pz-hero">
      <h2>Fresh. Hot. Delivered to Your Door.</h2>
      <p>Handcrafted pizzas made with love in Bengaluru.</p>
      <button
        className="pz-btn-primary"
        aria-label="Scroll to menu section"
        onClick={handleOrderNow}
      >
        Order Now
      </button>
    </section>
  );
}
