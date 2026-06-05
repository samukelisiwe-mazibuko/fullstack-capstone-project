import React, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage() {

  // states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register handler
  const handleRegister = async () => {
  const response = await fetch("http://localhost:3060/api/auth/register", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        name: `${firstName} ${lastName}`,
        email,
        password
        })
  });

    const data = await response.json();
    console.log(data);

    if (data.authtoken) {
        sessionStorage.setItem("token", data.authtoken);
        window.location.href = "/app";
      }
    };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">

            <h2 className="text-center mb-4 font-weight-bold">Register</h2>

            <input
              className="form-control mb-2"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

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
              className="btn btn-primary w-100"
              onClick={handleRegister}
            >
              Register
            </button>

            <p className="mt-4 text-center">
              Already a member? <a href="/app/login">Login</a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;