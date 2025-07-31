 import React, {useState, useContext, useEffect, use} from 'react'
 import { userContext } from '../context/user.context.jsx';
 import { useNavigate } from 'react-router-dom';
 
 const UserAuth = ({children}) => {
   
    const {user} = useContext(userContext);

    const [loading, setLoading] = useState(true);
     const token = localStorage.getItem('token');
     const navigate = useNavigate();


     useEffect(() => {
  if (!token || !user) {
    navigate('/login');
  } else {
    setLoading(false);
  }
}, [token, user]);

     if(loading) {
         return (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-25 w-22 border-b-5 border-blue-500"></div>
            </div>
         );
     }

   return (
     <>
        {children}
    </>
   )
 }

    export default UserAuth;
 