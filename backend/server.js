 import 'dotenv/config';
 import http from 'http';
 import app from  './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import {generateResult} from './services/ai.service.js'; 

const port = process.env.PORT || 3000;


 const server = http.createServer(app);
 
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
     methods: ["GET", "POST","PUT","DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"],
  } 
});
  
 // Middleware to handle socket authentication or other checks
  io.use(async (socket, next) => {
    
  try {
      
      const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

      const projectId = socket.handshake.query.projectId;

      if (!projectId) {
        return next(new Error('Project ID is required'));
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error('Invalid Project ID'));
      }

       socket.project = await projectModel.findById(projectId);

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
        }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return next(new Error('Authentication error: Invalid token'));
      }
       
      socket.user = decoded; // Attach user info to the socket
      console.log('User authenticated:', socket.user);

        next();
      } 
  catch (error) {
      next(new Error('Authentication error'));
    }
    
  });

io.on('connection', socket => {
  console.log('A user connected:', socket.id);

   socket.roomId = socket.project._id.toString();  

   socket.join(socket.roomId); // Join the room for the project

  // Handle events for the project...

   socket.on('project-message', async data => {
    
    // Broadcast(Emit) the message to all users those are belongs to this project room..
    //console.log('Message received:', data);
    // console.log("Received data:", data);
     const message = data?.messages || data?.message;

      if (!message) {
    console.error('Invalid data received:', data);
    return;
   }

    const aiIsPresent = message.includes('@ai');

    socket.broadcast.to(socket.roomId).emit('project-message', data);
    
    if(aiIsPresent) {
    try {
      
       const prompt = message.replace('@ai', '').trim();
       const result = await generateResult(prompt);

        io.to(socket.roomId).emit('project-message', {
          
          message: result,

          sender: {
            _id: 'ai',
            email: 'Ai Assistant',
          }
        });
      } catch (error) {
        console.error('Error generating AI response:', error);
      }

      return;
    }
     
      //  socket.broadcast.to(socket.roomId).emit('project-message', data);
    });

  // socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { 
    console.log('A user disconnected:', socket.id);
    socket.leave(socket.roomId); // Leave the room when disconnected
   });
});


 server.listen(port, () => {
   console.log(`server is running on port ${port}`);
 })
