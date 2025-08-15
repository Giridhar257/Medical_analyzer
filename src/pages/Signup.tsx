import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';



const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, firstName, lastName);
      navigate('/dashboard');
    } catch (err) {
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
    <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Create Your Account
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Join Medical AI Analyzer to get started
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02]"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  </div>

  );
};

export default Signup;
