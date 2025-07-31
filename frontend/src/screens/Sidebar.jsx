const Sidebar = ({ 
  isSidePanelOpen, 
  setIsSidePanelOpen, 
  project 
}) => {
  return (
    <div className={`side-panel h-full w-72 flex flex-col gap-2 bg-slate-100 absolute transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0':'-translate-x-full'} top-0 pt-[60px]`}>
      <header className='flex justify-between p-3 w-full rounded-b-lg bg-red-300'>
        <h2 className='font-semibold italic flex items-center'>Members</h2>
        <button 
          className='cursor-pointer p-2'
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
        >
          <i className="ri-close-circle-fill"></i>
        </button>
      </header>

      {project.users && project.users.map((user) => {
        return (
          <div
            key={user._id}
            className="user flex gap-1 items-center cursor-pointer hover:bg-slate-300 shadow-md p-2 rounded-lg"
          >
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
  );
};

export default Sidebar;