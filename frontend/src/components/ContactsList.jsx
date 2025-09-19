import { useChatStore } from "../store/useChatStore";
import UserLoadingSkeleton from "./UserLoadingSkeleton";
import { useEffect } from "react";
const ContactsList = () => {
  const { allContacts, isUsersLoadding, setSelectedUser, getAllContacts } =
    useChatStore();
  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);
  if (isUsersLoadding) return <UserLoadingSkeleton />;
  return (
    <div className="space-y-2">
      {allContacts.map((contact) => (
        <div
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          key={contact._id}
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar online`}>
              <div className="size-12 rounded-full">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {contact.fullName}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactsList;
