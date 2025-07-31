 import { error } from "console";
import mongoose from "mongoose";

 //connect to MONGODB...

//console.log(process.env.MONGODB_URI)
 async function connect() {
    try { 
        const connectDB = await mongoose.connect(process.env.MONGODB_URI);
    
        console.log(`connected to mongoDB: ${connectDB.connection.host}`);
    }
    catch(error) {
        console.log("Mongodb connection error:", error);
    }
 };

 export default connect;