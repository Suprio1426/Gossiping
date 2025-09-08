
 import express from 'express';
 import morgan from 'morgan';
 import connect from './db/db.js';
 import userRoutes from './routes/user.routes.js';
 import projectRouter from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
 import cookieParser from 'cookie-parser'; 
 import cors from 'cors';


 connect();    //connect mongoDB...


 const app = express();

 app.use(cors(
  {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
   methods: ["GET", "POST","PUT","DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"],
}
 ));
 app.use(express.json());   
 app.use(cookieParser());   
 app.use(morgan('dev'));
 app.use(express.urlencoded({extended: true }) );

 app.use('/users', userRoutes);
 app.use('/projects', projectRouter);   
 app.use('/ai', aiRoutes);   

 app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

 app.get('/', (req, res) => {
    res.send("lets start");
 });

 export default app;
