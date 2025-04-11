import { useEffect, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import SidebarSkeleton from '../SidebarSkeleton/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleSwipe = (e) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      const startX = touch.clientX;
      let endX;

      const onTouchMove = (moveEvent) => {
        endX = moveEvent.changedTouches[0].clientX;
      };

      const onTouchEnd = () => {
        if (startX < 80 && endX - startX > 60) setIsOpen(true);
        if (startX > 200 && startX - endX > 60) setIsOpen(false);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };

      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchstart', handleSwipe);
    return () => document.removeEventListener('touchstart', handleSwipe);
  }, []);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-base-100 p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        <Users className="w-6 h-6" />
      </button>

      <aside
        className={`fixed lg:static z-40 inset-0 lg:inset-auto lg:h-[calc(100vh-4rem)] h-full w-72 bg-base-100 border-r border-base-300 flex flex-col transition-transform duration-300 transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="border-b border-base-300 px-4 py-3">
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-3">
      <img
        src={authUser?.profilePic || '/avatar.png'}
        alt="My profile"
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex flex-col overflow-hidden">
        <span className="font-semibold truncate text-base">
          {authUser?.fullName}
        </span>
        <span className="text-sm truncate">{authUser?.email}</span>

        {/* Online/Offline with dot */}
        <div className="flex items-center gap-1 text-xs mt-0.5">
          <span
            className={`w-2 h-2 rounded-full ${
              onlineUsers.includes(authUser._id)
                ? 'bg-green-500'
                : 'bg-gray-400'
            }`}
          ></span>
          <span>
            {onlineUsers.includes(authUser._id) ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
    <button
      onClick={() => setIsOpen(false)}
      className="lg:hidden text-xl transition-colors"
    >
      ✕
    </button>
  </div>
</div>

        <div className="px-4 py-3 flex items-center gap-2 border-b border-base-200">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">Show online only</span>
          <span className="text-xs">({onlineUsers.length - 1} online)</span>
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 flex items-center gap-3
                hover:bg-base-200 transition-colors
                ${selectedUser?._id === user._id ? 'bg-base-300' : ''}
              `}
            >
              <div className="relative">
                <img
                  src={user.profilePic || '/avatar.png'}
                  alt={user.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              <div className="text-left">
                <div className="font-medium text-sm truncate">{user.fullName}</div>
                <div className="text-xs">
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-4">No online users</div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;