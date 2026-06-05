import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>GiftLink</h1>

      <div>
        <Link to="/">Home</Link>
        <Link to="/main">Gifts</Link>
      </div>
    </nav>
  );
}

export default Navbar;
