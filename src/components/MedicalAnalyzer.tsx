import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface MedicalAnalyzerProps {
  reportId: number | null;
  onReportUpload: (id: number) => void;
}

const MedicalAnalyzer: React.FC<MedicalAnalyzerProps> = ({ reportId, onReportUpload }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !user) return alert("No file or user");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", String(user.id));

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reports/upload.php`, formData);
      if (res.data?.report_id) {
        onReportUpload(res.data.report_id);
        alert("✅ Report uploaded!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!reportId) return alert("Upload a report first");
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/analysis/ai_analyze.php?report_id=${reportId}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-full">
      <h2 className="text-xl font-bold mb-4">Medical Report Analyzer</h2>
      <label htmlFor="medical-file-upload" className="block mb-1 font-medium">
        Upload Medical Report:
      </label>
      <input
        id="medical-file-upload"
        type="file"
        title="Upload your medical report"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <div className="flex gap-2">
        <button onClick={handleUpload} className="px-4 py-2 bg-green-500 text-white rounded">Upload</button>
        <button onClick={handleAnalyze} className="px-4 py-2 bg-blue-500 text-white rounded">Analyze</button>
      </div>
      {loading && <p>Processing...</p>}

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          <p>{result.summary}</p>

          <h4 className="mt-4 font-semibold">Recommendations</h4>
          <ul className="list-disc ml-5">
            {result.recommendations?.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
          </ul>

          <h4 className="mt-4 font-semibold">Key Findings</h4>
          <ul className="list-disc ml-5">
            {result.key_findings?.map((kf: any, i: number) => (
              <li key={i}><strong>{kf.label}</strong> — {kf.value} ({kf.status})</li>
            ))}
          </ul>

          <h4 className="mt-4 font-semibold">Risk Factors</h4>
          <ul className="list-disc ml-5">
            {result.risk_factors?.map((rf: any, i: number) => (
              <li key={i}><strong>{rf.factor}</strong>: {rf.level} <span style={{ color: rf.color }}>●</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MedicalAnalyzer;





