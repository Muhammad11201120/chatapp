import useKeyboardSound from "../hooks/useKeyboardSound";
import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { XIcon, ImageIcon, SendIcon } from "lucide-react";
const MessageInput = () => {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    sendMessage({ text: text.trim(), image: imagePreview });
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("يجب أن يكون الملف صورة");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };
  const removeImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return (
    <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-slate-700/50 sticky bottom-0 bg-slate-900/70 backdrop-blur-sm">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImagePreview}
              className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          onFocus={() => {
            // Ensure input is visible above keyboard
            requestAnimationFrame(() => {
              try {
                document.activeElement?.scrollIntoView({
                  block: "nearest",
                  inline: "nearest",
                });
              } catch {
                return;
              }
            });
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="اكتب رسالتك..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors  ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-cyan-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
