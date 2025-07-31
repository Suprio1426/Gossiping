const Modal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  users, 
  selectedUserId, 
  handleUserSelect, 
  addMembersToProject 
}) => {
  if (!isModalOpen) return null;

  return (
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
              key={user._id}
              onClick={() => handleUserSelect(user._id)}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition ${
                selectedUserId.indexOf(user._id) !== -1 ? 'bg-slate-400' : ''
              }`}
            >
              <div className="rounded-full bg-slate-800 w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center text-white font-bold">
                <i className="ri-user-3-fill"></i>
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
  );
};

export default Modal;