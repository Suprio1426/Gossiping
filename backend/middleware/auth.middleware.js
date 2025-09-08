 import jwt  from "jsonwebtoken";


       //FOR PROFILE AUTHORIZATION.....

 export const authUser = async (req, res, next) => {
      
   
   //why '?' because "If req.cookies exists, get token; otherwise return undefined instead of crashing...."

     try {
      
     //Use lowercase authorization when accessing headers in Express....
        
       const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

       //const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];


       if (!token) {
        return res.status(401).send({ error:'Unauthorised User'});
          }
          
        
               
         const decoded = await jwt.verify(token, process.env.JWT_SECRET);  

          //If the token is valid, attach the decoded user information to the request object
          //This allows you to access the user data in any route that uses this middleware......
         req.user = decoded;
          next();

    }   
    catch(error) {
        console.log(error);
         res.status(401).send({ error: 'Unauthorised User' });
    }
 }
