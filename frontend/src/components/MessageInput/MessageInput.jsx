import { useRef, useState } from 'react'
import { useChatStore } from '../../store/useChatStore';
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();


    // Handle image change
    // 1. Get the selected file
    // 2. Check if it is an image file
    // 3. If not, show an error toast
    // 4. If yes, read the file as a data url
    // 5. Set the image preview to the data url
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
          toast.error("Please select an image file");
          return;
        }
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      };
    
      // Handle image remove
      // 1. Clear the image preview
      // 2. Clear the file input value
      const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
    
      // Handle send message
      // 1. Prevent default form submission
      // 2. Check if the text is empty and no image is selected
      // 3. If yes, return
      // 4. Trim the text
      // 5. Send the message with the trimmed text
      // 6. Clear the form
      const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
    
        try {
          await sendMessage({
            text: text.trim(),
            image: imagePreview,
          });
    
          // Clear form
          // 1. Clear text
          // 2. Clear image preview
          // 3. Clear file input value
          setText("");
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      };
  return (
    <div className="p-4 w-full">

    {/* Image Preview galary section */}
    {imagePreview && (
      <div className="mb-3 flex items-center gap-2">
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
          />
          {/* if you want to remove the image */}
          <button
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
            type="button"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
    )}

    {/* Message input form */}
    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {/* Image upload button the input button is hidden because we use the button to trigger the file input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={`hidden sm:flex btn btn-circle
                   ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button>
      </div>
      <button
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim() && !imagePreview}
      >
        <Send size={22} />
      </button>
    </form>
  </div>
);
};

export default MessageInput