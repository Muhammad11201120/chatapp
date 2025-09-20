import { useChatStore } from "../store/useChatStore";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
const ChatHeader = () => {
  const { setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    };
    window.addEventListener("keydown", handleEscKey);
    //cleaning up the event listener
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className=" flex justify-between items-center bg-slate-800/50 flex-1 max-h-[84px] px-6 border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="size-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium ">
            {selectedUser.fullName}
          </h3>
          <p className="text-slate-400 text-xs">
            {isOnline ? "متصل" : "غير متصل"}
          </p>
        </div>
      </div>
      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="size-5 text-slate-400 hover:text-slate-200 transition-colors" />
      </button>
    </div>
  );
};

export default ChatHeader;
