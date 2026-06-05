import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">

      {/* Navbar */}
      <header className="navbar">
        <h1>GiftLink</h1>
        <nav>
        <a href="/">Home</a>
        <a href="/gifts">Gifts</a>
        <a href="/search">Search</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Find the Perfect Gift</h2>
        <p>Discover meaningful gifts for every occasion</p>
        <button>Get Started</button>
      </section>

      {/* Features */}
      <section className="features">
        <div className="card">Easy Search</div>
        <div className="card">Smart Suggestions</div>
        <div className="card">Personalized Gifts</div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 GiftLink</p>
      </footer>

    </div>
  );
}

export default App;