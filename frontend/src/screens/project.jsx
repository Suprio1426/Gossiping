 import React,{useState, useEffect, useContext, useRef } from 'react'
import { data, useLocation, useNavigate } from 'react-router-dom';
 import axios from '../config/axios.js';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js'; 
import { userContext } from '../context/user.context.jsx';
import Markdown from 'markdown-to-jsx';
import hljs from "highlight.js";
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/atom-one-dark.css';
import { getWebContainer } from '../config/webcontainer.js';



function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

  const project = () => {


    const location = useLocation(); 

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState([]);
    const [users, setUsers] = useState([]);
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('');
    const {user} = useContext(userContext); 
     const messageBox = React.createRef();

     const [ fileTree, setFileTree ] = useState({})
     const [messages, setMessages] = useState([]);
     const [currentFile, setCurrentFile] = useState(null);
     const [openFiles, setOpenFiles] = useState([]);
     const [webContainer, setWebContainer] = useState(null);
     const [iframeUrl, setIframeUrl] = useState(null);
     const [runProcess, setRunProcess] = useState(null);


    const handleUserSelect = (id) => {
    setSelectedUserId([...selectedUserId, id]);

        if (selectedUserId.includes(id)) {
          // Remove the user if already selected
          setSelectedUserId(selectedUserId.filter(uid => uid !== id));
       } else {
        // Add the user if not selected
        setSelectedUserId([...selectedUserId, id]);
      }
      return selectedUserId;
  };

   function addMembersToProject() {
      
    axios.put('/projects/add-user', {
      projectId: location.state.project._id,
      users: selectedUserId
   }).then((res) => {
      console.log("Members added successfully:", res.data);
      setIsModalOpen(false);
    })
   .catch((err) => {  
      console.error("Error adding members:", err);
   });

  };

   function sendMessageToProject() {
      if (!message.trim()) return;

    sendMessage('project-message', {
      message,
      sender : user,
       });

       

       setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state

       setMessage(""); // Clear the input field after sending
      }
    


 function WriteAiMessage(message) {

   const messageObject = JSON.parse(message)

  return (
    <div
      className="overflow-auto bg-slate-950 text-white rounded-sm p-2 break-words 
      whitespace-pre-wrap shadow overflow-y-scroll 
       [&::-webkit-scrollbar]:hidden"
    >
         <Markdown
            children={messageObject.text}
                options={{
                      overrides: {
                        code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }



  

   function scrollToBottom() {
  
     messageBox.current.scrollTop = messageBox.current.scrollHeight;
  
   }

   useEffect( () => {
     
        // Initialize socket connection on Client side
        // Pass the project ID to the socket connection

         initializeSocket(project._id);

         if ( !webContainer) {
          getWebContainer().then(container => {
            setWebContainer(container);
            console.log("WebContainer initialized");
           });

         }

     receiveMessage('project-message', data => {

          console.log(data);
            
            if (data.sender._id == 'ai') {

                const message = JSON.parse(data.message)

                console.log(message);

                webContainer?.mount(message.fileTree)

                if (message.fileTree) {

                    setFileTree(message.fileTree || {})
                }

                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
              
            }
             else {

                setMessages(prevMessages => [ ...prevMessages, data ]) 
            }

            scrollToBottom(); // Scroll to the bottom after receiving a new message

          });
         

      
    axios.get(`/projects/get-project/${location.state.project._id}` )
        .then((res) => {
          setProject(res.data.project);
        })
        .catch((err) => {
          console.error("Error fetching project:", err);
        });


     // Fetch all users to display in the modal
       axios.get('/users/all')
       .then((res) => { 
         setUsers(res.data.users);  }
        )
        .catch((err) => {
         console.error("Error fetching users:", err);}
        );

       }, [ ]);

  function saveFileTree(ft) {
       axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        })
        .then(res => 
          {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    //console.log(location.state);

  return (
    <main
    className="h-screen w-screen flex">
    <section
        className="left relative flex flex-col h-screen min-w-96 bg-slate-200">
    
         <header
           className='flex justify-between items-center p-3 px-4 w-full absolute top-0 left-0 right-0 bg-slate-500 z-10'>
           <button
               onClick={()=>setIsModalOpen(true)}
             className='flex p-1 gap-2 cursor-pointer items-center hover:bg-slate-600 rounded-lg transition-colors'>
              <i className="ri-user-add-fill aspect-square p-1 rounded-full text-white bg-slate-900 flex items-center justify-center w-fit h-fit"></i>
              <p className='font-semibold italic text-black'>Add</p>
           </button>

            <button
               onClick={()=>setIsSidePanelOpen(!isSidePanelOpen)} 
               className='p-2 rounded-2xl cursor-pointer hover:bg-slate-600 transition-colors text-black'>
               <i className="ri-group-fill"></i>
           </button> 
        </header>

        

       <div className = "conversation-area pt-17 pb-10 flex-grow flex flex-col h-full relative"> 
         
         <div
           ref={messageBox}
            className ="message-box flex-grow flex flex-col gap-1 overflow-auto max-h-full p-1 overflow-y-scroll [&::-webkit-scrollbar]:hidden"> 

             {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                <div className='text-sm'>
                                    {msg.sender._id === 'ai' ?
                                        WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
        </div>
    
       <div className ="inputField w-full flex absolute bottom-0 bg-white p-1">
        <textarea
          className ='p-3 flex flex-col flex-grow resize-none border-none outline-none text-sm text-gray-800 italic placeholder: whitespace-pre-line overflow-y-scroll [&::-webkit-scrollbar]:hidden'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder={`Start Gossiping with Ai...`}
          rows={1} >

          </textarea>
       <button 
         onClick = {sendMessageToProject }
         className='px-4 rounded-4xl cursor-pointer bg-green-500'>
          <i className="ri-send-plane-2-fill"></i>
        </button>
         </div>

        </div>
     
     {/* side-panel */}

        <div className={`side-panel h-full w-72 flex flex-col gap-2 bg-slate-100 absolute transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0':'-translate-x-full'} top-0 pt-[60px]`}>
       <header
         className='flex justify-between p-3 w-full rounded-b-lg bg-red-300'>
          <h2 className='font-semibold italic flex items-center'>Members</h2>
          <button className='cursor-pointer p-2'
        onClick={()=> setIsSidePanelOpen(!isSidePanelOpen)}>
        <i className="ri-close-circle-fill"></i>
          </button>
       </header>

       {project.users && project.users.map((user) => {
          return (
            <div
              key={user._id}
              className="user flex gap-1 items-center cursor-pointer hover:bg-slate-300 shadow-md p-2 rounded-lg">
              <div className="aspect-square rounded-full p-5 bg-slate-800 flex flex-col items-center justify-center w-fit h-fit">
                <i className="ri-user-2-fill absolute text-white"></i>
              </div>
              <h1 className='text-md font-semibold text-gray-800 p-2'>
                {user.email}
              </h1>
            </div>
          );
       })}
       
      
        </div>
    </section>

     
    <section className="right flex-grow h-full bg-red-100 flex">

      
      <div className="explorer h-full max-w-72 min-w-60 bg-amber-50">
       <div className="file-tree w-full">
         {
            Object.keys(fileTree).map( (file, index ) => (
            <button
             className="tree-element p-2 px-6 flex items-center gap-4 cursor-pointer hover:bg-slate-200 w-full rounded-lg"
            onClick={() => {
              setCurrentFile(file)
              setOpenFiles([...new Set([...openFiles, file])]); // Add file to openFiles if not already present
            }}>
            <p className='font-semibold text-gray-900 text-sm'>
              {file}
            </p>
           </button>
            ))
         }
       </div>
        </div>
      
      
    
       <div 
          className="code-editor flex flex-col flex-grow h-full shrink">

          <div className="top flex justify-between w-full">

             <div className="files flex"> 
              {
                openFiles.map((file, index) => (
                  <button
                    onClick={() => {setCurrentFile(file)}}
                     className={`open-file p-2 px-4 bg-slate-200 rounded-lg cursor-pointer items-center gap-2 w-fit flex ${currentFile === file ? 'bg-slate-400' : ''}`}
                 >
                    <p
                     className='font-semibold text-lg'>
                      {file}
                     </p>
                    </button>
                   
                    ))
               }
            </div>

            <div className="actions flex gap-2">
            <button
              onClick={
                 async () => {
                 await webContainer?.mount(fileTree);

               const installProcess = await webContainer.spawn("npm", [ "install" ])

               installProcess.output.pipeTo(new WritableStream({
                       write(chunk) {
                          console.log(chunk)
                               }
                      }));

                 if (runProcess) {
                    runProcess.kill();
                   }

               let tempRunProcess = await webContainer.spawn("npm", [ "start" ]);   
               
               tempRunProcess.output.pipeTo(new WritableStream({
                         write(chunk)
                          {
                           console.log(chunk);
                                        }
                      }));

                  setRunProcess(tempRunProcess)

                 webContainer.on('server-ready', (port, url) => {
                          console.log(port, url)
                            setIframeUrl(url)
                   })
              
            }}

            className='p-2 px-4 bg-slate-300 rounded-lg cursor-pointer text-black font-semibold hover:bg-slate-400 transition-colors'>
              Run
             </button>

            </div>  
       </div>

         <div className="bottom flex flex-grow max-w-full h-full shrink overflow-auto">
             
            {
              fileTree[ currentFile ] &&  (
                <div className="code-editor-area  h-full overflow-auto flex-grow bg-slate-800">
                 <pre
                  className ="hljs min-h-full bg-transparent">
                  <code 
                    className= "hljs min-h-full bg-transparent outline-none"
                      contentEditable
                      suppressContentEditableWarning
                       onBlur={(e) => {
                            const updatedContent = e.target.innerText;
                               const ft = 
                               {
                                 ...fileTree,
                                  [ currentFile ]:
                                   {
                                      file: {
                                        contents: updatedContent
                                          }
                                     }
                                }
                                   setFileTree(ft)
                                   saveFileTree(ft)
                                            }}
                    dangerouslySetInnerHTML={{ __html: hljs.highlight(fileTree[currentFile].file.contents, { language: 'javascript' }).value }}

                    style={{
                          whiteSpace: 'pre-wrap',
                          paddingBottom: '25rem',
                          counterSet: 'line-numbering'
                       }}
                 />
             </pre>
          </div> 
         )
       }
     </div>    
            
   </div>
     
       {iframeUrl && webContainer &&
                 ( <div className="flex min-w-96 flex-col h-full">
                        <div className="address-bar">
                            <input
                             type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl} className="w-full p-2 px-4 bg-slate-200" />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full">            
                        </iframe>
                    </div>
                   
                  )
            }

    </section>



      {/* modal */}

        {isModalOpen && (
  <div className="modal fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-6 lg:p-8">
    <div className="bg-slate-300 rounded-lg shadow-lg shadow-black w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col gap-2 relative max-h-[65vh]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold">Select an User</h2>
        <button
          onClick={() => setIsModalOpen(false)} 
          className="text-gray-500 hover:text-red-500"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>
      
      <div className="usersList flex flex-col gap-2 max-h-[55vh] overflow-y-auto bg-white p-2 rounded-lg">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => handleUserSelect(user._id)}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition ${
              selectedUserId.indexOf(user._id) !== -1 ? 'bg-slate-400' : ''
            }`}
          >
            <div className="rounded-full bg-slate-800 w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center text-white font-bold">
              <i class="ri-user-3-fill"></i>
            </div>

            <div className="flex flex-col text-left">
              
              <span className="text-xs font-semibold text-gray-900 truncate">{user.email}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={addMembersToProject}
        className="mx-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-800 text-sm sm:text-base w-full sm:w-auto"
      >
        Add members
      </button>
    </div>
  </div>
 )}
     
      </main>
     )
 }

 

 export default project;