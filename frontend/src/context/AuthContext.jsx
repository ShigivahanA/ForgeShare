import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/login', credentials);
      
      if (res.data.twoFactorRequired) {
        return res.data; // Return to handle in UI
      }

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (userId, otp) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/verify2fa', { userId, otp });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await api.post('/auth/forgotpassword', { email });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const res = await api.put(`/auth/resetpassword/${token}`, { password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      setLoading(true);
      const res = await api.put('/users/onboarding', onboardingData);
      setUser(res.data.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Onboarding failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const res = await api.put('/users/updatedetails', profileData);
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyAadharOTP = async (aadharNumber) => {
    try {
      setLoading(true);
      const res = await api.post('/users/aadhar/send-otp', { aadharNumber });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmAadharVerification = async (aadharNumber, otp) => {
    try {
      setLoading(true);
      const res = await api.post('/users/aadhar/verify', { aadharNumber, otp });
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (base64Image) => {
    try {
      setLoading(true);
      const res = await api.put('/users/avatar', { avatar: base64Image });
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      setLoading(true);
      const res = await api.delete('/users/avatar');
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Deletion failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (listingId) => {
    try {
      const res = await api.post(`/users/wishlist/${listingId}`);
      setUser(prev => ({ ...prev, wishlist: res.data.data }));
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update wishlist');
      throw err;
    }
  };

  const updateConsents = async (consentData) => {
    try {
      setLoading(true);
      const res = await api.put('/users/consents', consentData);
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Consent update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ 
      user, loading, error, signup, login, verify2FA, logout, 
      forgotPassword, resetPassword, completeOnboarding, 
      clearError, updateProfile, verifyAadharOTP, 
      confirmAadharVerification, uploadAvatar, deleteAvatar,
      toggleWishlist, updateConsents
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
