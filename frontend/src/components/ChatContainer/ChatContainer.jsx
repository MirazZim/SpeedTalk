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
  const socket = useAuthStore.getState().socket;
  const messageEndRef = useRef(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showReactionOptions, setShowReactionOptions] = useState(null); // Store the message ID of the open reaction options
  const typingTimeoutRef = useRef(null);

  // Common reaction emojis
  const commonReactions = ['❤️', '😂', '😮', '😢', '😠', '👍'];

  // Toggle emoji reaction options
  const toggleReactionOptions = (messageId) => {
    console.log("Toggling reaction options for messageId:", messageId);
    setShowReactionOptions(showReactionOptions === messageId ? null : messageId);
  };

  // Handle reaction click
  const handleReact = (messageId, emoji) => {
    const reaction = { emoji, userId: authUser._id };
    console.log("Sending reaction:", { messageId, reaction });
  
    // Use the store function instead of direct socket emit
    useChatStore.getState().sendReaction(messageId, reaction);
  
    setShowReactionOptions(null); // Hide reaction options after selecting
  };

  // Listen for "typing" events and update indicator state immediately
  useEffect(() => {
    if (!selectedUser) return;
    const handleTyping = ({ receiverId, isTyping }) => {
      setIsUserTyping(isTyping);
    };

    socket.on("typing", handleTyping); // Listen for typing events
    
    return () => {
      socket.off("typing", handleTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedUser, socket]);

  useEffect(() => {
    if (selectedUser && selectedUser._id) {
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

  // Listen for new reactions and update state
  useEffect(() => {
    const handleNewReaction = (updatedMessage) => {
      console.log("Received new reaction from server:", updatedMessage);
      
      // Update the messages state but preserve original message properties
      useChatStore.setState((state) => ({
        messages: state.messages.map((msg) => {
          if (msg._id === updatedMessage._id) {
            // Preserve all original message properties and just update the reactions
            return {
              ...msg,
              reactions: updatedMessage.reactions
            };
          }
          return msg;
        }),
      }));
    };
  
    socket.on("new-reaction", handleNewReaction);
  
    return () => {
      socket.off("new-reaction", handleNewReaction);
    };
  }, [socket]);

  // Group reactions by emoji type
  const getReactionCounts = (reactions) => {
    if (!reactions || reactions.length === 0) return {};
    
    const counts = {};
    reactions.forEach(reaction => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
    
    return counts;
  };

  // Check if the current user has already reacted with a specific emoji
  const hasUserReacted = (reactions, emoji) => {
    if (!reactions) return false;
    return reactions.some(reaction => 
      reaction.userId === authUser._id && reaction.emoji === emoji
    );
  };

  // Get the most common reaction or first one for display
  const getPrimaryReaction = (reactions) => {
    if (!reactions || reactions.length === 0) return null;
    
    const counts = getReactionCounts(reactions);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

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
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} relative mb-8`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                  alt="profile picture of user"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col relative">
              {message.image && (
                <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
              )}
              {message.text && <p>{message.text}</p>}

              {/* Only show emoji button for the receiver's side */}
              {message.senderId !== authUser._id && (
                <button 
                  onClick={() => toggleReactionOptions(message._id)}
                  className="absolute -bottom-4 right-2 size-6 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-200 transition-colors"
                >
                  {message.reactions && message.reactions.length > 0 ? (
                    <span className="text-sm">{getPrimaryReaction(message.reactions)}</span>
                  ) : (
                    <span className="text-sm">🫥</span>
                  )}
                </button>
              )}
            </div>
            
            {/* Display reaction options when emoji button is clicked */}
            {showReactionOptions === message._id && (
              <div className={`absolute ${message.senderId === authUser._id ? "right-0" : "left-12"} -bottom-16 z-10`}>
                <div className="bg-base-200 rounded-full px-2 py-1 shadow-md flex">
                  {commonReactions.map((emoji) => (
                    <button 
                      key={emoji} 
                      onClick={() => handleReact(message._id, emoji)}
                      className="hover:bg-base-300 rounded-full px-2 py-1 transition-colors"
                    >
                      <span className="text-lg">{emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        ))}

        {isUserTyping && (
          <div className="chat chat-start animate-fade-in">
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src={selectedUser?.profilePic || "/avatar.png"} alt="profile picture of user" />
              </div>
            </div>
            <div className="chat-bubble bg-base-300 min-h-10 min-w-12 flex items-center justify-center">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messageEndRef}></div>
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;