import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login clicked");
    console.log({ email, password });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">

            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

            <input
              className="form-control mb-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="btn btn-success w-100"
              onClick={handleLogin}
            >
              Login
            </button>

            <p className="mt-4 text-center">
              New here? <a href="/app/register">Register Here</a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;