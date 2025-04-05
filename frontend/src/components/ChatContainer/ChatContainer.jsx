import React, { useEffect } from 'react'
import { useChatStore } from '../../store/useChatStore';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageInput from '../MessageInput/MessageInput';
import MessageSkeleton from '../MessageSkeleton/MessageSkeleton';

const ChatContainer = () => {
    const { messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages, } = useChatStore();

    useEffect(() => {
        getMessages(selectedUser._id);

       
    }, [selectedUser._id, getMessages]);

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
            <ChatHeader />

            <p>messages</p>

            <MessageInput />


        </div>
    )
}

export default ChatContainer