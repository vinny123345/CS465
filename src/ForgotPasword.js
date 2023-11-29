import React, { useState } from "react";
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import {  getEmail } from './DBUtils';
import { Link } from 'react-router-dom';
import './ForgotPasword.css'

export function PasswordReset() {
  const [netId, setNetId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const email = getEmail(netId);
      sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage(error.message); 
    }
  };

  return (
    <div className="password-reset">
      <h1>Reset your password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="netId">NetId</label>
        <input
          type="netId"
          id="netId"
          value={netId}
          onChange={(e) => setNetId(e.target.value)}
          required
        />
        <br/>
        <button type="submit">Send password reset email</button>
      </form>

      <Link to="/login"> Log in </Link>



   
      {message && <p>{message}</p>} 
    </div>
  );
}

