import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Example: http://localhost/project/medisense

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/login.php?ts=${Date.now()}`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/signup.php?ts=${Date.now()}`,
        { email, password, first_name: firstName, last_name: lastName },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      console.log('✅ Signup success:', res.data);
      await login(email, password);
    } catch (err: any) {
      console.error('❌ Signup error:', err);
      throw new Error(err.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




