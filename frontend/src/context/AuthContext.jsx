import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      if (!token || !savedUser) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Use saved user data instead of fetching from API
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.auth.login(credentials);
      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'SET_USER', payload: user });
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.auth.register(userData);
      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);  
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'SET_USER', payload: user });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    checkAuthStatus,
    dispatch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;