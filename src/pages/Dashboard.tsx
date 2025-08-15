import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FileUp, ClipboardList, AlertTriangle, Stethoscope } from "lucide-react";

type KeyFinding = { label: string; value: string; status?: string };
type RiskFactor = { factor: string; level?: string; color?: string };

type AIResponse = {
  summary?: string;
  recommendations?: string[] | string;
  key_findings?: KeyFinding[] | string;
  risk_factors?: RiskFactor[] | string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost/medisense";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const normalizeArray = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    if (typeof val === "string") {
      return val.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const normalizeKeyFindings = (val: any): KeyFinding[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    if (typeof val === "string") {
      return val
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const match = line.match(/^(.+?)\s+[—:-]\s+(.+?)\s*(\((.+)\))?$/);
          if (match) {
            return { label: match[1].trim(), value: match[2].trim(), status: match[4]?.trim() };
          }
          return { label: line, value: "" };
        });
    }
    return [];
  };

  const normalizeRiskFactors = (val: any): RiskFactor[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    if (typeof val === "string") {
      return val
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((line) => ({ factor: line, level: "", color: "" }));
    }
    return [];
  };

  const handleUploadAndAnalyze = async () => {
    setError(null);
    setResult(null);

    if (!file) {
      alert("Please select a file.");
      return;
    }
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", String(user.id));

      const uploadRes = await axios.post(`${API_BASE}/reports/upload.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      const reportId = uploadRes.data?.report_id;
      if (!reportId) {
        throw new Error("Upload succeeded but no report_id returned.");
      }
      console.log("✅ File uploaded, Report ID:", reportId);

      const aiRes = await axios.get(`${API_BASE}/analysis/ai_analyze.php?report_id=${reportId}`, {
        timeout: 120000,
      });

      const data = aiRes.data;
      let parsed: AIResponse | null = null;
      if (!data) {
        parsed = null;
      } else if (typeof data === "string") {
        parsed = { summary: data };
      } else if (data.summary || data.recommendations || data.key_findings || data.risk_factors) {
        parsed = {
          summary: data.summary ?? (data.analysis ?? ""),
          recommendations: data.recommendations ?? data.recs ?? [],
          key_findings: data.key_findings ?? data.findings ?? [],
          risk_factors: data.risk_factors ?? data.risks ?? [],
        };
      } else {
        parsed = {
          summary: data.analysis ?? "",
          recommendations: data.recommendations ?? [],
          key_findings: data.key_findings ?? [],
          risk_factors: data.risk_factors ?? [],
        };
      }

      if (!parsed || (!parsed.summary && !parsed.recommendations && !parsed.key_findings)) {
        console.warn("AI returned no structured data, raw:", aiRes.data);
        alert("AI did not return structured analysis. Check server logs/debug file.");
        setResult(null);
      } else {
        const finalResult: AIResponse = {
          summary: parsed.summary ?? "",
          recommendations: normalizeArray(parsed.recommendations),
          key_findings: normalizeKeyFindings(parsed.key_findings),
          risk_factors: normalizeRiskFactors(parsed.risk_factors),
        };
        setResult(finalResult);
      }
    } catch (err: any) {
      console.error("❌ Error in upload/analyze:", err);
      setError(err?.response?.data?.error || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700 tracking-wide">
      Medical Report Dashboard
    </h2>

    {/* Upload Card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 p-6 rounded-xl shadow-lg border border-blue-100 max-w-3xl mx-auto text-center"
    >
      <label className="block font-medium mb-3 text-gray-700">
        Select Medical Report:
      </label>

      {/* Drag & Drop / Click to Upload */}
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <svg
          className="w-12 h-12 text-blue-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16V4m0 0L3 8m4-4l4 4m10 4v8m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        <p className="text-blue-600 font-semibold">
          Click to upload or drag & drop
        </p>
        <p className="text-gray-500 text-sm">PDF, JPG, PNG supported</p>
      </label>

      {/* Show selected file name */}
      {file && (
        <p className="mt-3 text-sm text-gray-500">Selected: {file.name}</p>
      )}

      {/* Upload & Analyze button */}
      <button
        onClick={handleUploadAndAnalyze}
        disabled={loading}
        className="mt-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-lg shadow hover:shadow-lg hover:from-blue-700 hover:to-teal-600 transition-all w-full sm:w-auto"
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {error && (
        <p className="mt-3 text-red-600 font-medium bg-red-50 p-2 rounded">
          ⚠ {error}
        </p>
      )}
    </motion.div>

    {/* Results */}
    {result && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 space-y-6 max-w-3xl mx-auto"
      >
        {/* Summary */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 p-6 rounded-xl shadow border border-blue-100"
        >
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-blue-700">
            <ClipboardList className="h-5 w-5" /> Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{result.summary}</p>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 p-6 rounded-xl shadow border border-green-100"
        >
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
            <Stethoscope className="h-5 w-5" /> Recommendations
          </h4>
          {Array.isArray(result.recommendations) && result.recommendations.length > 0 ? (
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {result.recommendations.map((rec, i) => (
                <li key={i}>{String(rec)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No specific recommendations provided.</p>
          )}
        </motion.div>

        {/* Key Findings */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 p-6 rounded-xl shadow border border-yellow-100"
        >
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-700">
            <AlertTriangle className="h-5 w-5" /> Key Findings
          </h4>
          {Array.isArray(result.key_findings) && result.key_findings.length > 0 ? (
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {result.key_findings.map((kf, i) => (
                <li key={i}>
                  {kf.label ? (
                    <>
                      <strong>{kf.label}:</strong> {kf.value}{" "}
                      {kf.status ? `(${kf.status})` : ""}
                    </>
                  ) : (
                    String(kf)
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No key findings detected.</p>
          )}
        </motion.div>

        {/* Risk Factors */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 p-6 rounded-xl shadow border border-red-100"
        >
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" /> Risk Factors
          </h4>
          {Array.isArray(result.risk_factors) && result.risk_factors.length > 0 ? (
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {result.risk_factors.map((rf, i) => (
                <li key={i}>
                  {rf.factor ? (
                    <>
                      <strong>{rf.factor}:</strong> {rf.level ?? ""}
                    </>
                  ) : (
                    String(rf)
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No specific risk factors identified.</p>
          )}
        </motion.div>
      </motion.div>
    )}
  </div>

  );
};

export default Dashboard;









