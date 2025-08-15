import { div, img } from 'framer-motion/client';
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
return (
  <>
    <div
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
      }}
      className="flex flex-col items-center justify-center text-center p-6"
    >
      <h1
        className="text-5xl font-extrabold text-white mb-4 animate-fadeIn"
        style={{ animation: 'fadeIn 1.2s ease-in-out' }}
      >
        Welcome to <span className="text-blue-400">MediSense</span>
      </h1>

      <p
        className="text-lg text-gray-200 mb-8 max-w-xl animate-fadeIn"
        style={{ animation: 'fadeIn 1.5s ease-in-out' }}
      >
        Upload and analyze your medical reports with our smart health assistant — get insights instantly.
      </p>

      <Link
        to="/signup"
        className="bg-blue-500 text-white px-6 py-3 rounded-full border-2 border-blue-500 
                   hover:bg-white hover:text-blue-500 hover:shadow-lg 
                   transition-all duration-300 font-semibold inline-flex items-center justify-center space-x-2 animate-fadeIn"
        style={{ animation: 'fadeIn 2s ease-in-out' }}
      >
         Get Started
      </Link>
    </div>

    <style>
      {`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      `}
    </style>
  </>
);
};

export default Home;
