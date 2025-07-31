//  import projectModel from "../models/project.model.js";
//  import * as projectService from "../services/project.services.js";
//  import userModel from "../models/user.model.js";  
//  import { validationResult } from "express-validator";
//  import e from "express";
       

//  export const createProject = async (req, res) => { 
     
//     const errors = validationResult(req);
//      if(!errors.isEmpty()) {
//          return res.status(400).json({ errors: errors.array() });
//        }
    
//        try {

//          console.log('Full request body:', req.body);

//          const { name , email} = req.body;
//       // const userId = req.user._id; 
//        console.log('Incoming email:', req.body.email); 
         
//        console.log('Destructured name:', name);
//         console.log('Destructured email:', email);
//         console.log('Type of email:', typeof email);

//           const userEmail = email;
//       const loggedInUser = await userModel.findOne({email: userEmail}); 

//        console.log('User found:', loggedInUser);

//         const userId = loggedInUser._id; 
//          console.log('User ID:', userId);
//         // Get the ID of the logged-in user..
       
//         const newProject = await projectService.createProject({ name, userId: userId });
         
//          console.log('Project created:', newProject);

//          res.status(201).json( newProject );

//        }
//        catch(error) {
//         console.log(error);
//          return res.status(400).json({error: error.message});
//        }
       
//  }

import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.services.js";
import userModel from "../models/user.model.js";  
import { validationResult } from "express-validator";
import e from "express";
import mongoose from "mongoose";

export const createProject = async (req, res) => { 
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        
        const { name, email } = req.body;
        
        // console.log('Destructured name:', name);
        // console.log('Destructured email:', email);
        // console.log('Type of email:', typeof email);
        
        // Check if email exists
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }
        
        // Try using a different variable name to avoid any potential conflicts
        const userEmail = email;
        const loggedInUser = await userModel.findOne({ email: userEmail }); 
        
        console.log('User found:', loggedInUser);
        
        if (!loggedInUser) {
            return res.status(404).json({ error: 'User not found with this email' });
          }
        
        const userId = loggedInUser._id; 
        //console.log('User ID:', userId);
        
        const newProject = await projectService.createProject({ name: name, userId: userId });

        //console.log('Project created:', newProject);

        res.status(201).json(newProject);

    } catch(error) {
        console.log('Error occurred:', error);
        console.log('Error stack:', error.stack);
        return res.status(400).json({ error: error.message });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        // const userId = req.user._id;   // Get the ID of the logged-in user
        // const projects = await projectModel.find({ users: userId }).populate('users', 'name email'); // Populate user details
        
        // if (!projects || projects.length === 0) {
        //     return res.status(404).json({ message: 'No projects found for this user' });
        // }

        const loggedInUser = await userModel.findOne({ email: req.user.email });

        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const allUserProjects = await projectService.getAllProjectByUserId({ userId: loggedInUser._id });
        
       return res.status(200).json( {projects: allUserProjects});
    } 
    catch (error) {
        console.log('Error fetching projects:', error);
        res.status(400).json({ error: error.message});
    }

}

export const addUserToProject = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, users } = req.body; // Expecting an array of user IDs
        //const projectId = req.params.projectId; // Assuming project ID is passed as a URL parameter
      
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        
        if (!loggedInUser) {
            return res.status(404).json({ error: 'User not found' });
        }

     // let userId = loggedInUser._id; 

        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        const Project = await projectService.addUserToProject({ projectId, users, userId: loggedInUser._id });

       return res.status(200).json(Project);
    } 
    catch (error) {
        console.log('Error adding users to project:', error);
        res.status(400).json({ error: error.message });
    }
}

export const getProjectById = async (req, res) => {
       
    const { projectId } = req.params; // Assuming project ID is passed as a URL parameter
         if (!projectId) {
        return res.status(400).json({ error: 'Project ID is required' });
    }

     if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }
    // console.log('Request params:', req.params);
    //  console.log('Project ID:', projectId);
  try {

     const project = await projectService.getProjectById({ projectId }); 

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

    return res.status(200).json({project});
    
      
  }
   catch (error) {
    console.log('Error fetching project by ID:', error);
    res.status(400).json({ error: error.message });
   }

}

export const updateFileTree = async (req, res) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const { projectId, fileTree } = req.body; // Expecting an object representing the file tree

        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        // if (!fileTree || typeof fileTree !== 'object') {
        //     return res.status(400).json({ error: 'File tree must be a valid object' });
        // }

        const updatedProject = await projectService.updateFileTree({ 
            projectId,
             fileTree });

        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        return res.status(200).json({updatedProject});
    } 
    catch (error) {
        console.log('Error updating file tree:', error);
        res.status(400).json({ error: error.message });
    }
}