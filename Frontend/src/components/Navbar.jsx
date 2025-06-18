import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="logo-text">TravelingCooker</span>
          <span className="ai-badge">AI</span>
        </Link>
      </div>
      
      <ul className="navbar-links">
        <li className={isActive('/')}>
          <Link to="/">Home</Link>
        </li>
        <li className={isActive('/about')}>
          <Link to="/about">About Our AI</Link>
        </li>
        <li className={isActive('/contact')}>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      
      <div className="try-ai-button">
        <Link to="/">Try Our AI Trip Planner</Link>
      </div>
    </nav>
  );
}

export default Navbar; 