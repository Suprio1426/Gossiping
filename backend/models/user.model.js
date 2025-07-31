 import mongoose from "mongoose";
 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";

 const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength:[6,'Email must be atleast 6 chracters long'],
        maxLength:[50, 'Email must no be longer than 50 chracters']
     },

      //( select: false)=> It's for security reasons— so 
       //when you fetch a user,the password doesn't accidentally get exposed........

     password: {
        type: String,
        select: false,                  
                                        
     }
 },{timestamps: true})


 userSchema.statics.hashPassword = async function (password) {
        //bcrypt.hash(password,10) => 10 is the number of rounds to use when generating a salt.
        //The higher the number, the more secure the hash, but the longer it takes to compute.
     return await bcrypt.hash(password,10);
 }

 userSchema.methods.isValidPassword = async function (password) {
     return await bcrypt.compare(password, this.password);
 }

 userSchema.methods.generateJWT = function () {
     return jwt.sign({email: this.email}, process.env.JWT_SECRET, {expiresIn: '24h'});  //token expires in 24h.
 }

 const User =mongoose.model('user', userSchema);

export default User;
