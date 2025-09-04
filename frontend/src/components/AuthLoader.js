import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from '../store/authSlice';

const AuthLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AuthLoader;