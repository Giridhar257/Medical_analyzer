import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface MedicalReport {
  id: number;
  user_id: number;
  file_name: string;
  file_size: number;
  analysis_status: 'pending' | 'completed';
  created_at: string;
}

interface AnalysisResult {
  id: number;
  report_id: number;
  summary: string;
  key_findings: any;
  recommendations: any;
  risk_factors: any;
  created_at: string;
}

export const useMedicalReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchReports = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/reports/fetch.php?user_id=${user.id}`);
      setReports(res.data);
    } catch (err) {
      console.error('❌ Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  // const uploadReport = async (file: File): Promise<number | null> => {
  //   if (!user) return null;

  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('user_id', user.id.toString());

  //   try {
  //     const res = await axios.post(`${API_BASE_URL}/reports/upload.php`, formData);
  //     await fetchReports();
  //     return res.data.id;
  //   } catch (err) {
  //     console.error('❌ Error uploading report:', err);
  //     return null;
  //   }
  // };
  const uploadReport = async (file: File): Promise<number | null> => {
  if (!user) return null;

  const formData = new FormData();
  formData.append('file', file); // must match $_FILES['file']
  formData.append('user_id', user.id.toString());

  const res = await axios.post(`${API_BASE_URL}/reports/upload_report.php`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });

  await fetchReports();
  return res.data.id;
};


  const saveAnalysisResult = async (
    reportId: number,
    analysisData: Omit<AnalysisResult, 'id' | 'report_id' | 'created_at'>
  ) => {
    try {
      await axios.post(`${API_BASE_URL}/analysis/save.php`, {
        report_id: reportId,
        ...analysisData
      });
      await fetchReports();
    } catch (err) {
      console.error('❌ Error saving analysis:', err);
    }
  };

  const getAnalysisResult = async (reportId: number): Promise<AnalysisResult | null> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/analysis/get.php?report_id=${reportId}`);
      return res.data || null;
    } catch (err) {
      console.error('❌ Error getting analysis result:', err);
      return null;
    }
  };

  const deleteReport = async (reportId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/reports/delete.php`, {
        report_id: reportId
      });
      await fetchReports();
    } catch (err) {
      console.error('❌ Error deleting report:', err);
    }
  };

  return {
    reports,
    loading,
    uploadReport,
    saveAnalysisResult,
    getAnalysisResult,
    deleteReport,
    refetch: fetchReports
  };
};
