 import axios from 'axios';

 const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
 });
    axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ✅ always latest
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



 export default axiosInstance;

 //THIS IS THE AXIOS INSTANCE THAT WE WILL USE TO MAKE REQUESTS TO THE BACKEND... 