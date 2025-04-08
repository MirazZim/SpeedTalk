import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageInput from '../MessageInput/MessageInput';
import MessageSkeleton from '../MessageSkeleton/MessageSkeleton';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';
import TypingIndicator from '../TypingIndicator/TypingIndicator';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Log selectedUser changes
  useEffect(() => {
    console.log("ChatContainer: selectedUser changed:", selectedUser);
  }, [selectedUser]);

  // Listen for "typing" events and update indicator state immediately
  useEffect(() => {
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    console.log("Setting up typing listener for user:", selectedUser._id);
    
    const handleTyping = ({ receiverId, isTyping }) => {
        setIsUserTyping(isTyping);
    };

    socket.on("typing", handleTyping); 
    
    return () => {
      socket.off("typing", handleTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedUser]);

  useEffect(() => {
    console.log("isUserTyping state changed:", isUserTyping);
  }, [isUserTyping]);

  // Fetch messages and subscribe to new ones
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      console.log("Fetching messages for user:", selectedUser._id);
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current && (messages || isUserTyping)) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserTyping]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat Header */}
      <ChatHeader />

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile picture of user"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        
        {/* Modern Typing indicator inside messages container as a chat message */}
        {isUserTyping && (
          <div className="chat chat-start animate-fade-in">
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={selectedUser?.profilePic || "/avatar.png"}
                  alt="profile picture of user"
                />
              </div>
            </div>
            <div className="chat-bubble bg-base-300 min-h-10 min-w-12 flex items-center justify-center">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        {/* Reference for auto-scroll */}
        <div ref={messageEndRef}></div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;