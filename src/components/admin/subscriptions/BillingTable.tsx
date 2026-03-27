import { billingEvents } from "@/data/subscription";

export default function BillingTable() {
  return (
    <section className="billing-events-card">
      <div className="billing-events-header">
        <h2>Recent Billing Events</h2>
        <a href="#">View All Ledger</a>
      </div>

      <div className="billing-table-wrap">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Event Type</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {billingEvents.map((event) => (
              <tr key={`${event.name}-${event.date}`}>
                <td>
                  <div className="subscriber-cell">
                    <div className="subscriber-avatar">{event.initials}</div>
                    <div>
                      <p className="subscriber-name">{event.name}</p>
                      <p className="subscriber-email">{event.email}</p>
                    </div>
                  </div>
                </td>

                <td>{event.eventType}</td>

                <td>
                  <span className={`plan-badge plan-${event.plan.toLowerCase()}`}>
                    {event.plan}
                  </span>
                </td>

                <td className="billing-amount">{event.amount}</td>
                <td className="billing-date">{event.date}</td>

                <td>
                  <span className={`status-pill ${event.statusType}`}>
                    <span className="status-dot">●</span>
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="billing-load-more">LOAD MORE HISTORY ▼</div>
    </section>
  );
}