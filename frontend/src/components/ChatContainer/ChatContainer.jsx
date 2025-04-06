import { useEffect } from 'react'
import { useChatStore } from '../../store/useChatStore';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageInput from '../MessageInput/MessageInput';
import MessageSkeleton from '../MessageSkeleton/MessageSkeleton';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';

const ChatContainer = () => {
    const { messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages, } = useChatStore();
    const { authUser } = useAuthStore();
    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        };r
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    
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
        <div className='flex-1 flex flex-col overflow-auto'>
            {/* Chat Header */}
            <ChatHeader />

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}

                        /* 
                            We set the chat-end class if the message sender is the current user 
                            so the chat bubble will be aligned to the right side of the screen 
                            and chat-start if the message sender is the other user 
                            so the chat bubble will be aligned to the left side of the screen 
                        */
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        
                    >
                        {/* Chat Image */}
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                {/* Chat user Image */}
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
                        {/* Chat Header */}
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">

                                {/* 
                                    We format the message time using the formatMessageTime function 
                                    which formats the date to a time string 
                                */}
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
            </div>

            <MessageInput />


        </div>
    )
}

export default ChatContainer