import { useChatStore } from "../store/useChatStore";
const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore();
  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        className={`tab ${
          activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400 border-none"
            : "text-slate-400"
        }`}
        onClick={() => setActiveTab("chats")}
      >
        الدردشات
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab ${
          activeTab === "contacts"
            ? "bg-cyan-500/20 text-cyan-400 border-none"
            : "text-slate-400"
        }`}
      >
        المتحدثين
      </button>
    </div>
  );
};

export default ActiveTabSwitch;
