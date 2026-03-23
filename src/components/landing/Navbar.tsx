export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-container">
        <div className="logo">Syntrix</div>

        <nav className="desktop-nav">
          <a href="#" className="active">
            Platform
          </a>
          <a href="#">Solutions</a>
          <a href="#">Pricing</a>
        </nav>

        <div className="nav-actions">
          <a href="#" className="signin-link">
            Sign In
          </a>
          <a href="#" className="header-btn">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}