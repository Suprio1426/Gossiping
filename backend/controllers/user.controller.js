 import userModel from '../models/user.model.js';
 import * as userServices from '../services/user.service.js';
 import { validationResult } from 'express-validator';


      //create user......

 export const createUserController = async (req, res) => {
  
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    try{
        const user = await userServices.createUser(req.body);

        const token = await user.generateJWT();

        delete user._doc.password;     //for removing the password before sending the response.....

        res.status(201).json({user, token });
     } 
    catch(error) {
           return res.status(400).send(error.message);
    }


 }

      //FOR LOGIN.....

 export const loginController = async (req, res) => {
   
    try{
         //validation of request body....
         
         const errors = validationResult(req);
       console.log(req.body);
        if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
            }

          const{email, password} = req.body;

          //User verification....

          const user = await userModel.findOne({email}).select("+password");
          
         if (!user) {
             return res.status(401).json({//errors:"invalid credential"
              message: "user not found"});
         }

         //pasword matching......

        const isMatched = await user.isValidPassword(password);
         
        if (!isMatched) {
           return  res.status(401).json({errors:"invalid credential"});
        }
           
       //IF ALL CREDENTIALS VALID THEN TOKEN GENERATE...
       

       const token = await user.generateJWT(); 

          delete user._doc.password;

         res.status(201).json({user, token });
               
     } 
    catch(error) {

           return res.status(400).send(error.message);
           //console.log(error);    
      }

 }

      //for profile authorization....

  export const profilecontroller = async (req, res) => {

    console.log("req user:",req.user);

    res.status(200).json({user: req.user});

   }

   export const logoutController = async (req, res) => {
      try{
         
         const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
          //const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

      
      const result = await redisClient.set(token, 'logout', 'EX', 60 * 60 * 24); // 24h
      
         console.log("result:", result);

         res.status(200).json({
            message: 'Logged out successfully'
         })

      }catch(err){

         console.log(err);
         res.status(400).send(err.message);
            }
         }


   export const getAllUsersController = async (req, res) => {

     try{
        
        const loggedInUser = await userModel.findOne({email: req.user.email});
        
         const userId = loggedInUser._id;
        const allUsers = await userServices.getAllUsers({userId});

        res.status(200).json({users: allUsers});

     }
     catch(error) {
           return res.status(400).send(error.message);
     }
   



   }      
