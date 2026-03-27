export default function SubscriptionHeader() {
  return (
    <section className="subscriptions-hero">
      <div>
        <h1>Subscription Management</h1>
        <p>
         Manage your plans, track revenue growth, and improve your customers’ experience.
        </p>
      </div>

      <div className="subscriptions-hero-actions">
        <button className="sub-btn sub-btn-light">
          <span>↓</span>
          Export Financial Report
        </button>

        <button className="sub-btn sub-btn-gold">
          <span>＋</span>
          Add New Plan Tier
        </button>
      </div>
    </section>
  );
}