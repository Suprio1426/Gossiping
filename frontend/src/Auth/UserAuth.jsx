 import React, { useState, useContext, useEffect } from 'react';
import { userContext } from '../context/user.context.jsx';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({ children }) => {
  const { user, setUser } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  useEffect(() => {
    
    if (!token) {
      navigate('/login');
      
    }

    // If user already exists, no need to refetch
    if (user) {
      setLoading(false);
    
    }
     if (!user) {
            navigate('/login')
        }
   

  }, [user, setUser, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"  ></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserAuth;

