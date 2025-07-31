 import socket from 'socket.io-client';


 let socketInstance = null;

 export const initializeSocket = (projectId) => {

    socketInstance = socket(import.meta.env. VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token') || token
        },
         query: {
            projectId
         },
    });

    return socketInstance;
 }

 export const receiveMessage = (eventName, data) => {
     if (!socketInstance) {
        console.error('Socket instance is not initialized');
        return;
       }

       socketInstance.on(eventName, data);
 }

 export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.error('Socket instance is not initialized');
        return;
      }

    socketInstance.emit(eventName, data);
 }