const navItems = [
  "Dashboard",
  "Analytics",
  "Product",
  "Subscriptions",
  "Report",
];

export default function AdminTopNav() {
  return (
    <header className="admin-topnav">
      <div className="admin-brand">
        <div className="admin-brand-logo">
          <div className="admin-brand-logo-inner" />
        </div>
        <span>Syntrix</span>
      </div>

      <nav className="admin-topnav-menu">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className={item === "Analytics" ? "active" : ""}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="admin-topnav-actions">
        <button className="admin-circle-btn with-text">
          <span className="admin-icon">⚙</span>
          Setting
        </button>
        <button className="admin-circle-btn" aria-label="Notifications">
          <span className="admin-icon">🔔</span>
        </button>
        <button className="admin-circle-btn" aria-label="Profile">
          <span className="admin-icon">◌</span>
        </button>
      </div>
    </header>
  );
}