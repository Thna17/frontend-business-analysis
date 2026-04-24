import { Button } from "@/components/ui/button";

export default function SubscriptionHeader() {
  return (
    <section className="subscriptions-hero">
      <div>
        <h1 className="dashboard-title">Subscription Management</h1>
        <p className="dashboard-subtitle mt-2 max-w-xl">
          Manage your plans, track revenue growth, and improve your customers&apos; experience.
        </p>
      </div>

      <div className="subscriptions-hero-actions">
        <Button className="px-6" size="lg">
          <span>+</span>
          Export Financial Report
        </Button>
        <Button className="px-6" size="lg">
          <span>+</span>
          Add New Plan Tier
        </Button>
      </div>
    </section>
  );
}
