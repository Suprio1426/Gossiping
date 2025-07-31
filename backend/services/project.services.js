//  import projectModel from "../models/project.model.js";


//  export const createProject = async ({ name, userId }) => {
          
//     if(!name || !userId){
//         throw new Error('Name and userId are required');
        
//     }

//     const project = await projectModel.create({
//         name,
//         users: [userId]  // Assuming usersId is an array of user IDs...
//     })

//     return project;

//  }


import e from "express";
import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, userId }) => {
    
    // Add detailed logging to see what's being received
    // console.log('Creating project with:', { name, userId });
    
    if(!name || !userId){
        console.log('Validation failed - missing required fields');
        throw new Error('Name and userId are required');
    }

    
    let project;
    
    try {
        project = await projectModel.create({
        name,
        users: [userId]
       });

    } catch (error) {
         if (error.code === 11000) {
         throw new Error('Project name must be unique');  // Duplicate key error
            
          }
         throw error;                               
       }
        
    return project;
 }

 export const getAllProjectByUserId = async ({userId}) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const allUserProject = await projectModel.find({ users: userId });

    return allUserProject;
 }


export const addUserToProject = async ({ projectId, users, userId }) => {

    if (!projectId || !users) {
        throw new Error('Project ID and users are required');
    }

    if(!userId) {
        throw new Error('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid projectId');
    }

    for (const userId of users) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error(`Invalid userId: ${userId}`);
        }
    }

    const project = await projectModel.findOne({_id: projectId,
        users: userId
    });
    
    if (!project) {
        throw new Error("User not belong to this project");
    }

 const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } }, // Use $addToSet to avoid duplicates
    { new: true, runValidators: true } // Return the updated document and run validators
 )

    return updatedProject;
 }

 export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    // if (!mongoose.Types.ObjectId.isValid(projectId)) {
    //     throw new Error('Invalid projectId');
    // }
    
    const project = await projectModel.findOne({_id:projectId}).populate('users'); 
    // Populate users to get user details in the project    
    // .populate('users', 'name email role') to get name, email, and role fields
    // If you want to populate all fields, you can just use .populate('users')  
    
    return project;
 }

 export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    },
     {
        fileTree
    }, 
    {
        new: true
    })

    return project;
}