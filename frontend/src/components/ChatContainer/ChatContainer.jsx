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
  const [showReactionOptions, setShowReactionOptions] = useState(null);
  const typingTimeoutRef = useRef(null);

  const commonReactions = ['❤️', '😂', '😮', '😭', '😠', '👍'];

  const toggleReactionOptions = (messageId) => {
    setShowReactionOptions(showReactionOptions === messageId ? null : messageId);
  };

  const handleReact = (messageId, message, emoji) => {
    const reaction = { emoji, userId: authUser._id };
    const hasReacted = hasUserReacted(message.reactions, emoji);

    if (hasReacted) {
      useChatStore.getState().removeReaction(messageId, reaction);
    } else {
      useChatStore.getState().sendReaction(messageId, reaction);
    }
    setShowReactionOptions(null);
  };

  useEffect(() => {
    if (!selectedUser) return;
    const handleTyping = ({ receiverId, isTyping }) => {
      setIsUserTyping(isTyping);
    };
    socket.on("typing", handleTyping);
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
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && (messages || isUserTyping)) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserTyping]);

  useEffect(() => {
    const handleNewReaction = (updatedMessage) => {
      useChatStore.setState((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === updatedMessage._id ? { ...msg, reactions: updatedMessage.reactions } : msg
        ),
      }));
    };

    const handleRemoveReaction = (updatedMessage) => {
      useChatStore.setState((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === updatedMessage._id ? { ...msg, reactions: updatedMessage.reactions } : msg
        ),
      }));
    };

    socket.on("new-reaction", handleNewReaction);
    socket.on("reaction-removed", handleRemoveReaction);

    return () => {
      socket.off("new-reaction", handleNewReaction);
      socket.off("reaction-removed", handleRemoveReaction);
    };
  }, [socket]);

  const getReactionCounts = (reactions) => {
    if (!reactions || reactions.length === 0) return {};
    const counts = {};
    reactions.forEach((reaction) => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
    return counts;
  };

  const getAllUniqueReactions = (reactions) => {
    if (!reactions || reactions.length === 0) return [];
    return [...new Set(reactions.map(r => r.emoji))];
  };

  const hasUserReacted = (reactions, emoji) => {
    if (!reactions) return false;
    return reactions.some((reaction) => reaction.userId === authUser._id && reaction.emoji === emoji);
  };

  const getUserReaction = (reactions) => {
    if (!reactions || reactions.length === 0) return null;
    const userReaction = reactions.find((reaction) => reaction.userId === authUser._id);
    return userReaction ? userReaction.emoji : null;
  };

  const formatText = (text) => {
    const maxLength = 25;
    if (!text) return '';
    return text.replace(/(\S{25})(?=\S)/g, '$1\u200B');
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} items-end gap-2 relative mb-10 group`}
          >
            <div className="chat-image avatar">
              <div className="size-10 md:size-12 rounded-full border">
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

            <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] flex flex-col relative">
              <div className="chat-bubble flex flex-col relative p-3 sm:p-4 rounded-2xl shadow-md">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && (
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line overflow-wrap-anywhere">
                    {formatText(message.text)}
                  </p>
                )}

                {/* Emoji Reactions Display (Bottom-Right) */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="absolute -bottom-4 right-2 flex gap-1 z-10">
                    {getAllUniqueReactions(message.reactions).map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleReact(message._id, message, emoji)}
                        className={`inline-flex items-center justify-center rounded-full text-sm 
              ${hasUserReacted(message.reactions, emoji)
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                          } p-1 hover:bg-gray-200 transition-colors`}
                        title={`${hasUserReacted(message.reactions, emoji) ? "Remove" : "Add"} ${emoji} reaction`}
                      >
                        <span className="text-xs">{emoji}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Emoji Picker (Top-Right) */}
                {message.senderId !== authUser._id && (
                  <button
                    onClick={() => toggleReactionOptions(message._id)}
                    className={`group-hover:opacity-100 opacity-0 absolute w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 active:bg-gray-400 transition-all duration-150 shadow-sm z-10 -top-3 right-1`}
                    aria-label="Add a reaction"
                  >
                    {getUserReaction(message.reactions) ? (
                      <span className="text-lg leading-none animate-bounce">
                        {getUserReaction(message.reactions)}
                      </span>
                    ) : (
                      <span className="text-lg leading-none">😊</span>
                    )}
                  </button>
                )}
              </div>


            </div>

            {showReactionOptions === message._id && (
              <div
                className={`absolute top-0 ${message.senderId === authUser._id ? "right-0" : "left-0"} -mt-12 z-10 flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
              >
                <div className="bg-gray-800 rounded-full px-4 py-2 shadow-lg flex items-center gap-3 animate-fade-in">
                  {commonReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReact(message._id, message, emoji)}
                      className="hover:scale-125 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      aria-label={`React with ${emoji}`}
                    >
                      <span className="text-2xl">{emoji}</span>
                    </button>
                  ))}
                  <button
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label="More reactions"
                  >
                    <span className="text-2xl">+</span>
                  </button>
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