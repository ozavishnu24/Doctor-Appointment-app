import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, loadUser } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Try to get token from localStorage
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      if (token && !user) {
        try {
          await dispatch(loadUser()).unwrap();
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsInitialized(true);
    };
    initializeAuth();
  }, [dispatch, user]);

  const login = async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      
      // Store token and user in localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result));
      
      // Set user data immediately
      dispatch(setUser(result.user || result));
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      
      // Store token and user in localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result));
      
      // Set user data immediately
      dispatch(setUser(result.user || result));
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    // Clear both token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout: logoutUser,
  };
};