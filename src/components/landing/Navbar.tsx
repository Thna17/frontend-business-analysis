export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-container">
        {/* ✅ LOGO */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full border border-slate-400 text-slate-700">
            <span className="text-lg leading-none">◡</span>
          </div>

          <p className="logo text-2xl font-semibold tracking-tight text-slate-900">
            Syntrix
          </p>
        </div>

        {/* NAV */}
        <nav className="desktop-nav">
          <a href="#" className="active">
            Platform
          </a>
          <a href="#">Solutions</a>
          <a href="#pricing">Pricing</a>
        </nav>

        {/* ACTIONS */}
        <div className="nav-actions">
          <a href="/login" className="signin-link">
            Sign In
          </a>
          <a href="/signup" className="header-btn">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}