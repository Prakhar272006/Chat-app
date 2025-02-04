import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';

const Sidebar = () => {
  const { users, getUsers, isUserLoading, setSelectedUser, selectedUser } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => {setSelectedUser(user)
              console.log(user)}
            
            }
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
            <span className="hidden lg:block">{user.fullName}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;