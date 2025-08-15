import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 p-6">
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-4">📬 Contact Us</h1>
      <p className="text-gray-700 mb-6 text-lg">
        We're here to help! Reach out to us anytime for support or inquiries.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-blue-700 text-2xl">📧</span>
          <a
            href="mailto:support@medisense.com"
            className="text-blue-700 hover:text-blue-900 transition font-medium"
          >
            support@medisense.com
          </a>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <span className="text-blue-700 text-2xl">📞</span>
          <a
            href="tel:+919945443783"
            className="text-blue-700 hover:text-blue-900 transition font-medium"
          >
            +91-9945443783
          </a>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => (window.location.href = '/')}
          className="px-6 py-2 rounded-full bg-blue-700 text-white font-semibold shadow-md hover:bg-blue-900 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>

  );
};

export default Contact;