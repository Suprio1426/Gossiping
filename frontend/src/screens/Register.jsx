 import React, {useState, useContext} from 'react'
 import {Link, useNavigate } from 'react-router-dom';
 import axios from '../config/axios';
 import { userContext } from '../context/user.context';

 const Register = () => {

   const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [Password, setPassword] = useState('')

    const {setUser} = useContext(userContext); // Access the setUser function from the UserContext
    // This will allow you to update the user state in the context when the user logs in...
 
   const submitHandler = (e) => {
     
     e.preventDefault();

      const email = e.target.email.value;
      const password = e.target.password.value;

     const res = axios.post('/users/register', {
        email,
        password
       }).then((res) => {

        console.log(res.data)

        localStorage.setItem('token', res.data.token) 
        setUser(res.data.user) 
                             
        navigate('/')

       }).catch((err) => {

        console.log(err.res?.data)
       })
     
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-[#10213a] text-white">
       <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-2xl shadow-lg">

          <div className='w-full h-[50px] rounded-b-[30] pt-2.5 flex items-center justify-center m-0 '>
         <h1 className="text-blue-600 text-2xl font-bold text-center mb-6 font-stretch-semi-condensed tracking-wider">Welcome to <span className='text-2xl text-amber-100 italic'>Gossiping..</span></h1></div>
         <h2 className="text-2xl font-bold text-center">Register Here</h2>

         <form onSubmit={submitHandler} className="space-y-4">
           <div>
             <label htmlFor="email" className="block text-sm font-medium">Email</label>
             <input
             onChange={ (e) => setEmail(e.target.value) }
               type="email"
               id="email"
               required
               className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>
 
           <div>
             <label htmlFor="password" className="block text-sm font-medium">Password</label>
             <input
              onChange={ (e) => setPassword(e.target.value) }
               type="password"
               id="password"
               required
               className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
             />
           </div>
 
           <button
             type="submit"
             className="w-full py-2 bg-blue-600 hover:bg-blue-800 rounded-xl font-bold transition shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             Register Now
           </button>
         </form>
         <p className="text-center text-sm font-semibold">
           Already have an Account?{' '}
 
           <Link to="/login" className="text-blue-400 hover:underline">Login Now</Link>
 
         </p>
       </div>
     </div>
   );
 }
 
 export default Register;