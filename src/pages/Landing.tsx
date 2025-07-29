import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import pg from "../assets/pg.png";

export default function Landing() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
      alert("Please sign in first to access the dashboard.");
    }
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          {/* Replace logo.png with your PNG image */}
          <img src={pg} alt="Logo" />
        </div>
        <button className="btn-signin" onClick={() => navigate("/login")}>
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Design, Code, Deploy</h1>
        <p>
          A collaborative AI micro-frontend playground that helps you move fast with precision.
        </p>
        <div className="hero-buttons">
          <button className="btn-dashboard" onClick={handleDashboardClick}>
            Go to Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2025 AI Playground. Crafted with precision by Jitender.
      </footer>
    </div>
  );
}
