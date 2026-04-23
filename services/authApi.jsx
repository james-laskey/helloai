// services/authApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://helloapi-five.vercel.app/api/auth';

// Helper to store auth data
const storeAuthData = async (accessToken, refreshToken, user) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};

// Helper to clear auth data
const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export const authApi = {
  // User login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Login failed',
        };
      }
      
      // Store tokens and user data
      await storeAuthData(data.accessToken, data.refreshToken, data.user);
      
      return {
        success: true,
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  },

  // User signup
  signup: async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Signup failed',
        };
      }
      
      // Store tokens and user data
      await storeAuthData(data.accessToken, data.refreshToken, data.user);
      
      return {
        success: true,
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      console.error('Signup API error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Token refresh failed',
        };
      }
      
      // Update only the access token in storage
      await AsyncStorage.setItem('accessToken', data.accessToken);
      
      return {
        success: true,
        accessToken: data.accessToken,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: 'Network error',
      };
    }
  },

  // Logout
  logout: async (refreshToken) => {
    try {
      // Attempt to notify server about logout
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      // Clear local storage regardless of server response
      await clearAuthData();
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if server request fails
      await clearAuthData();
      return { success: true };
    }
  },

  // Get current user from storage
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get access token from storage
  getAccessToken: async () => {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return !!token;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  },

  // Update user profile (requires authentication)
  updateProfile: async (userData) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Update failed',
        };
      }
      
      // Update stored user data
      const currentUser = await authApi.getCurrentUser();
      const updatedUser = { ...currentUser, ...data.user };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  },

  // Change password (requires authentication)
  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      
      const response = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Password change failed',
        };
      }
      
      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }
};