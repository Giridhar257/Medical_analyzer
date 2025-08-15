import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 py-10">
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">
        About MediSense
      </h1>

      <p className="text-gray-700 leading-relaxed mb-4">
        We know that reading a medical report can feel like trying to understand a
        foreign language. Numbers, abbreviations, and medical terms can leave
        patients feeling overwhelmed and uncertain about their health. That’s why
        we created <span className="font-semibold text-blue-600">MediSense</span> —
        your personal AI-powered health interpreter.
      </p>

      <p className="text-gray-700 leading-relaxed mb-4">
        With MediSense, you simply upload your medical report, and within moments,
        it transforms into an easy-to-read summary, highlighting what’s normal,
        what needs attention, and what you can do next. Using cutting-edge AI
        technology, MediSense breaks down complex lab values, explains their
        significance, and even flags potential risks you should discuss with your
        doctor.
      </p>

      <p className="text-gray-700 leading-relaxed mb-4">
        It’s like having a knowledgeable friend who’s always ready to guide you
        through your health journey — without replacing your doctor, but helping
        you feel more informed and confident. Whether you’re tracking your
        recovery, managing a chronic condition, or just staying on top of your
        health, MediSense gives you the clarity and confidence you deserve.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        MediSense prioritizes privacy and security — all files are processed
        securely within your own server environment, ensuring that no sensitive
        health information is shared with unauthorized parties. The interactive
        dashboard presents results in an organized manner under clear headings
        such as Summary, Recommendations, Key Findings, and Risk Factors. Each
        finding is color-coded to help users quickly identify normal, borderline,
        or high-risk values.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Why Choose MediSense?</h2>
      <ul className="space-y-3 pl-5">
        <li className="flex items-start">
          <span className="text-blue-500 text-lg mr-2">✔</span>
          <span><strong>Instant AI Analysis</strong> – Upload your medical report and get AI-generated insights within seconds.</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-500 text-lg mr-2">✔</span>
          <span><strong>Simplified Medical Language</strong> – Translates complex medical terms into easy-to-understand explanations.</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-500 text-lg mr-2">✔</span>
          <span><strong>Personalized Health Recommendations</strong> – Tailored advice based on your test results.</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-500 text-lg mr-2">✔</span>
          <span><strong>Secure Processing</strong> – Your reports are analyzed locally; no external sharing of sensitive data.</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-500 text-lg mr-2">✔</span>
          <span><strong>Doctor-Friendly Summaries</strong> – Easy to share with healthcare professionals for follow-up consultations.</span>
        </li>
      </ul>
    </div>
  </div>

  );
};

export default About;