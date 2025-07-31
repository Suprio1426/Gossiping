import React, {useContext, useState, useEffect} from 'react'
import  {userContext}  from '../context/user.context'
import axios from  '../config/axios'
import { useNavigate } from 'react-router-dom';


 const Home = () => {

  const { user } = useContext(userContext)  // Access the user data from the UserContext..
    const[isModalOpen, setIsModalOpen] =useState(false);
    const [projectName, setProjectName] = useState(null);
    const [projects, setProjects] = useState([]); // State to hold projects

    const navigate = useNavigate(); // Hook to programmatically navigate

   async function createProject(e) {
    //console.log({projectName});
        e.preventDefault();
        if (!user) {
            console.error('User not logged in');
            alert('Please log in first');
            return;
          }

        if (!user.email) {
            console.error('User email not found');
            alert('User email not available');
            return;
           }
     try{

       const response = await axios.post('/projects/create', {
          name: projectName,
           email: user?.email         // Assuming user.email is available in the context
        },{
         headers: {
          'Content-Type': 'application/json'
         } 
          });
            const res = response.data;
          console.log('Project created successfully:', res);
          
           setIsModalOpen(false); 
        }
        catch(error) {
           if(error.response && error.response.status === 400) {
           console.log('Erroe respons:', error.response.data);
           }
          else {
                   // Something else happened
            console.error('Error:', error.message);
          }
      }
    }

    useEffect(() => {
      
      axios.get('/projects/all').then((response) => {
         const res = response.data;
         setProjects(res.projects);

      }).catch((error) => {
        console.log( error);
      });

    }, [isModalOpen]);
  return (

    
        <main className="p-4">

      <div className="projects flex flex-wrap gap-3">
           <button className="project m-2 p-4 bg-blue-300 rounded-lg shadow-md hover:shadow-black hover:bg-blue-400 transition duration-300 font-bold ml-2" onClick={() => setIsModalOpen(true)}>New Project 
            <i className="ri-link"></i>
           </button>
      {
        projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} 
                onClick={() => {navigate(`/project`, { state: { project } } )
              }}
                className="project-item m-2 p-4 flex flex-col gap-2 bg-gray-200 rounded-lg min-w-35 hover:bg-green-100 shadow-md hover:shadow-black transition duration-300 cursor-pointer">

                  <h3 className="text-lg font-semibold">{project.name}</h3>

                 <div className="flex gap-2">
                  <p><i class="ri-user-5-fill"><small  className='font-semibold'>Members :</small></i>{ project.users.length}</p>
                 </div>

                </div>
              ))
            )

            : (
              <p className="text-gray-500">No projects found.</p>
            )
      }
      </div>

    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-20">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <form onSubmit={createProject}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Project Name
              </label>
              <input
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}  
              
                type="text"
                id="projectName"
                name="projectName"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter project name" required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
        </main>
    );
  }

 
export default Home;