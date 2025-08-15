import React from 'react';

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 py-10">
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">
        Features
      </h1>

      <p className="text-gray-700 leading-relaxed mb-6 text-lg text-center">
        Our system offers <span className="font-semibold text-blue-600">AI-powered medical report analysis</span> that goes beyond basic file storage.  
        Users can upload PDF or scanned reports, and the platform instantly extracts and interprets medical data using advanced Natural Language Processing.  
        This eliminates manual reading and helps patients and healthcare providers quickly understand results.
      </p>

      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl"></span>
          <p className="text-gray-700 leading-relaxed">
            <strong>Automated Report Parsing</strong> – Uses a PDF parser to detect key medical parameters such as blood counts, glucose levels, cholesterol, and other vital statistics.  
            These are evaluated against standard ranges to determine if they are normal, borderline, or critical.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl"></span>
          <p className="text-gray-700 leading-relaxed">
            <strong>AI-Generated Summary</strong> – Provides a short yet comprehensive explanation of the report in plain language, highlighting abnormal values and possible concerns for easy understanding.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl"></span>
          <p className="text-gray-700 leading-relaxed">
            <strong>Recommendations Engine</strong> – Suggests actionable steps like dietary advice, lifestyle changes, or follow-up tests based on the findings for early prevention and better health management.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl"></span>
          <p className="text-gray-700 leading-relaxed">
            <strong>Key Findings Section</strong> – Breaks down the report into structured data, showing each parameter with its value and status so doctors and patients can focus on the most important points.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl"></span>
          <p className="text-gray-700 leading-relaxed">
            <strong>Risk Factors Identification</strong> – Flags potential health risks based on combined report data, categorizing them into low, moderate, and high severity with color-coded indicators.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl"></span>
          <p className="text-gray-700 leading-relaxed">
            <strong>User-Friendly Upload & Analysis</strong> – A quick and simple process where users select a file, click upload, and get AI-driven results in seconds. Works seamlessly on mobile and desktop.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl"></span>
          <p className="text-gray-700 leading-relaxed">
            <strong>Highly Extensible</strong> – Designed for future integration with wearable device data, hospital APIs, and multilingual support, making it scalable for personal and professional healthcare use.
          </p>
        </div>
      </div>
    </div>
  </div>

  );
};

export default Features;