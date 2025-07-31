 import project from "../models/project.model.js";
import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { body } from "express-validator"; 
import * as authMiddleware from "../middleware/auth.middleware.js";



const router = Router();  
// Define the route for creating a project..

router.post('/create', authMiddleware.authUser,
    body("name").isString().withMessage("Name is required"), projectController.createProject);

router.get('/all', authMiddleware.authUser, projectController.getAllProjects);  

router.put('/add-user' , authMiddleware.authUser, 
    
    body("projectId").isString().withMessage("Project ID must be a string"),
    body("users")
        .isArray({ min: 1 }).withMessage("Users must be a non-empty array")
        .custom((users) => users.every(user => typeof user === "string")).withMessage("Each user must be a string"),
    projectController.addUserToProject
);

// router.put('/remove-user', authMiddleware.authUser,
//     body("projectId").isString().withMessage("Project ID must be a string"),    

router.put('/update-file-tree',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree
)

router.get('/get-project/:projectId', authMiddleware.authUser, projectController.getProjectById);

export default router;
