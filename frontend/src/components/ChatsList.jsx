import { useChatStore } from "../store/useChatStore";
import UserLoadingSkeleton from "./UserLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
const ChatsList = () => {
  const { onlineUsers } = useAuthStore();
  const { chats, isUsersLoadding, getChatParteners, setSelectedUser } =
    useChatStore();
  useEffect(() => {
    getChatParteners();
  }, [getChatParteners]);
  if (isUsersLoadding) return <UserLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${
                onlineUsers.includes(chat._id) ? "online" : "offline"
              }`}
            >
              <div className="size-12 rounded-full">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatsList;
