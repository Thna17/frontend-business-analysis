const competencies = [
  {
    title: "Market Foresight",
    description:
      "Analyze macro-economic shifts with real-time ingestion engines. We don't just report the past; we calculate the most probable futures.",
    icon: "↗",
  },
  {
    title: "Predictive Modeling",
    description:
      "Sophisticated algorithmic frameworks that pressure-test enterprise decisions against thousands of volatility scenarios.",
    icon: "∿",
  },
  {
    title: "Enterprise Governance",
    description:
      "Consolidated oversight for institutional control. Maintain rigid compliance while fostering agile strategic pivots.",
    icon: "◌",
  },
];

export default function CompetencySection() {
  return (
    <section id="solutions" className="competencies-section">
      <div className="container">
        <div className="section-heading center">
          <p className="section-label">CORE COMPETENCIES</p>
          <h2>Engineered for Complexity</h2>
        </div>

        <div className="competency-grid">
          {competencies.map((item) => (
            <div className="competency-card fade-up" key={item.title}>
              <div className="competency-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
