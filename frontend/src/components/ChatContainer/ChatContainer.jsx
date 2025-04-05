import React, { useEffect } from 'react'
import { useChatStore } from '../../store/useChatStore';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageInput from '../MessageInput/MessageInput';

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

    if (isMessagesLoading) return <div>loading</div>

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <p>messages</p>

            <MessageInput />


        </div>
    )
}

export default ChatContainer