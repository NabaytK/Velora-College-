import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  onAuthChange, 
  registerUser, 
  loginUser, 
  logoutUser, 
  createUserData, 
  getUserData 
} from '../services/firebase';

// Create Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user);
      setLoading(true);
      
      if (user) {
        // If user is logged in, fetch their data
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAuthError(error.message);
        }
      } else {
        // If no user, clear user data
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signup = async (email, password, userInfo) => {
    try {
      setAuthError(null);
      setLoading(true);
      
      // Create Firebase Auth user
      const user = await registerUser(email, password);
      
      // Create user document in Firestore
      await createUserData(user.uid, {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: user.email,
        phone: userInfo.phone || '',
        // Don't store SSN in Firestore directly - it's handled by backend
        budget: userInfo.budget || 0,
        savings_goal: userInfo.savingsGoal || 0,
        debt: userInfo.debt || 0,
      });
      
      // If SSN is provided, send it to backend for encryption
      if (userInfo.ssn) {
        try {
          // Get auth token
          const token = await user.getIdToken();
          
          // Call backend to store encrypted SSN
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ssn: userInfo.ssn
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to store sensitive information');
          }
        } catch (error) {
          console.error('Error storing encrypted data:', error);
          setAuthError(error.message);
        }
      }
      
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      setAuthError(null);
      setLoading(true);
      const user = await loginUser(email, password);
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      
      // Set user-friendly error message
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setAuthError('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        setAuthError('Too many failed login attempts. Please try again later.');
      } else {
        setAuthError(error.message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setAuthError(null);
      await logoutUser();
    } catch (error) {
      console.error('Error logging out:', error);
      setAuthError(error.message);
      throw error;
    }
  };

  // Update user data in Firestore
  const updateProfile = async (data) => {
    try {
      setAuthError(null);
      setLoading(true);
      
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      // Get auth token
      const token = await currentUser.getIdToken();
      
      // Call backend to update user data
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        ...data
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get auth token for API calls
  const getAuthToken = async () => {
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }
    
    try {
      return await currentUser.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  };

  // Reset auth error
  const clearError = () => {
    setAuthError(null);
  };

  // Context value
  const value = {
    currentUser,
    userData,
    loading,
    authError,
    signup,
    login,
    logout,
    updateProfile,
    getAuthToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
