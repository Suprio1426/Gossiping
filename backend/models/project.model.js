 import mongoose from "mongoose";
  
const projectSchema = new mongoose.Schema({
    name : {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique : [true, 'Project name must be unique']  // Ensure project names are unique,
      },

    users: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'                           // 'user' refers to the model name of the user schema
        }
    ],
    fileTree: {
      type: Object,
       default: {}
    },

});

const project = mongoose.model('project', projectSchema);  

export default project;