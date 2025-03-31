import { useAuth } from '../contexts/AuthContext';

// Base API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Custom React hook to access the API service
 * This provides authenticated API calls using the current user's token
 */
export const useApi = () => {
  const { getAuthToken } = useAuth();
  
  /**
   * Make an authenticated API request
   * 
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Request options
   * @returns {Promise<object>} Response data
   */
  const apiRequest = async (endpoint, options = {}) => {
    try {
      // Get the auth token
      const token = await getAuthToken();
      
      // Prepare headers with auth token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      };
      
      // Make the request
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
      });
      
      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      // Parse and return data
      return await response.json();
    } catch (error) {
      console.error(`API error (${endpoint}):`, error);
      throw error;
    }
  };
  
  /**
   * Get AI-powered financial insights
   * 
   * @param {object} data - Financial data for insights
   * @returns {Promise<object>} AI insights response
   */
  const getFinancialInsights = async (data) => {
    return await apiRequest('/api/insights', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  
  /**
   * Get user's AI insights history
   * 
   * @param {number} limit - Maximum number of history items to retrieve
   * @returns {Promise<object>} Insights history
   */
  const getInsightsHistory = async (limit = 10) => {
    return await apiRequest(`/api/insights/history?limit=${limit}`);
  };
  
  /**
   * Add a new expense
   * 
   * @param {object} expenseData - Expense data to add
   * @returns {Promise<object>} Expense creation result
   */
  const addExpense = async (expenseData) => {
    return await apiRequest('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
  };
  
  /**
   * Get user's expenses with optional filters
   * 
   * @param {object} options - Query options (limit, category, start_date, end_date)
   * @returns {Promise<object>} Expenses data
   */
  const getExpenses = async (options = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.category) queryParams.append('category', options.category);
    if (options.startDate) queryParams.append('start_date', options.startDate);
    if (options.endDate) queryParams.append('end_date', options.endDate);
    
    const queryString = queryParams.toString();
    const endpoint = `/api/expenses${queryString ? '?' + queryString : ''}`;
    
    return await apiRequest(endpoint);
  };
  
  /**
   * Update user profile data
   * 
   * @param {object} profileData - Profile data to update
   * @returns {Promise<object>} Update result
   */
  const updateProfile = async (profileData) => {
    return await apiRequest('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    });
  };
  
  /**
   * Get user profile data
   * 
   * @returns {Promise<object>} User profile data
   */
  const getProfile = async () => {
    return await apiRequest('/api/users/profile');
  };
  
  // Return all API methods
  return {
    getFinancialInsights,
    getInsightsHistory,
    addExpense,
    getExpenses,
    updateProfile,
    getProfile,
    apiRequest
  };
};
