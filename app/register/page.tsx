"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log(data);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Registration</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </div>
        <div>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
