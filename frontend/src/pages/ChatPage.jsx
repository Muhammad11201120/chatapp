import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactsList from "../components/ContactsList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceHolder from "../components/NoConversationPlaceHolder";
const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-7xl h-[98dvh] md:h-[800px] px-0 md:px-0">
      <BorderAnimatedContainer>
        {/* Sidebar (List) - visible by default on mobile when no chat is selected; always visible on md+ */}
        <div
          className={`bg-slate-800/50 backdrop-blur-sm flex flex-col w-full md:w-80 ${
            selectedUser ? "hidden md:flex" : "flex"
          }`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
          </div>
        </div>

        {/* Chat Pane - hidden on mobile until a chat is selected; always visible on md+ */}
        <div
          className={`flex-1 flex flex-col bg-slate-800/50 backdrop-blur-sm ${
            selectedUser ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceHolder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
};

export default ChatPage;
