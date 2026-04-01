import { Button } from "@/components/ui/button";

export default function SubscriptionHeader() {
  return (
    <section className="subscriptions-hero">
      <div>
        <h1>Subscription Management</h1>
        <p>
          Manage your plans, track revenue growth, and improve your customers&apos; experience.
        </p>
      </div>

      <div className="subscriptions-hero-actions">
        <Button className=" h-11 rounded-full bg-[#d4af35] px-6 text-sm font-semibold text-[#1f2937] hover:bg-[#c9a62f]">
          <span>+</span>
          Export Financial Report
        </Button>
        <Button className="h-11 rounded-full bg-[#d4af35] px-6 text-sm font-semibold text-[#1f2937] hover:bg-[#c9a62f]">
          <span>+</span>
          Add New Plan Tier
        </Button>
      </div>
    </section>
  );
}
