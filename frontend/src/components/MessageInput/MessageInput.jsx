import { useRef, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage, sendTypingIndicator } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setText(value);
    sendTypingIndicator(value.trim().length > 0);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTypingIndicator(false), 5000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      sendTypingIndicator(false);
      setText('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="p-4 w-full bg-base-100">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-base-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-200 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex items-center gap-2 w-full">
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`btn btn-sm btn-circle transition-all duration-300 ${imagePreview
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'bg-base-200 text-base-content/40 hover:text-base-content'
              }`}
            aria-label="Upload Image"
          >
            <Image size={18} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            className="input input-bordered input-sm sm:input-md w-full rounded-lg"
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          aria-label="Send Message"
          className={`btn btn-sm btn-circle transition-all duration-300 ${text.trim() || imagePreview
              ? 'bg-primary text-white hover:scale-105 shadow-md'
              : 'bg-base-200 text-base-content/40 cursor-not-allowed'
            }`}
        >
          <Send size={18} className="transition-transform duration-200" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
