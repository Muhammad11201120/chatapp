import { useAuthStore } from "../store/useAuthStore";
const ChatPage = () => {
  const { logout } = useAuthStore();

  return (
    <button onClick={logout} className="z-10 border  p-2 cursor-pointer">
      تسجيل الخروج
    </button>
  );
};

export default ChatPage;
