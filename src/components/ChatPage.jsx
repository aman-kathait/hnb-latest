import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]"> 
          {/* 64px assumes some navbar height, adjust if different or remove calc */}

          {/* Sidebar */}
          {/* Sidebar */}
<aside className='w-full md:w-1/5 border-r border-gray-300 flex flex-col overflow-hidden'>
  <div className='overflow-y-auto flex-1 bg-white'>
    {suggestedUsers.map((suggestedUser) => {
      const isOnline = onlineUsers.includes(suggestedUser?._id);
      return (
        <div
          key={suggestedUser?._id}
          onClick={() => dispatch(setSelectedUser(suggestedUser))}
          className='flex gap-3 items-center p-3 hover:bg-green-100 cursor-pointer border-b border-gray-200'
        >
            {/* uncomment to show profile picture of other users */}
          {/* <Avatar className='w-10 h-10 flex-shrink-0'>
            <AvatarImage src={suggestedUser?.profilePicture} />
            <AvatarFallback>{suggestedUser?.fullName?.slice(0,2).toUpperCase() || "UN"}</AvatarFallback>
          </Avatar> */}
          <div className='flex flex-col'>
            {/* Removed truncate to allow full visibility and wrap */}
            <span className='font-medium break-words'>{suggestedUser?.fullName}</span>
            <span className="text-xs font-semibold text-green-800 break-words">
              {suggestedUser?.department}
            </span>
          </div>
          {isOnline && (
            <span className="ml-auto w-3 h-3 bg-green-500 rounded-full" title="Online"></span>
          )}
        </div>
      )
    })}
  </div>
</aside>


          {/* Chat Section */}
          {selectedUser ? (
            <main className='flex-1 flex flex-col bg-gray-50'>
              {/* Header */}
              <div className='flex items-center gap-3 px-4 py-3 border-b bg-white shadow-sm'>
                <Avatar>
                  <AvatarImage src={selectedUser?.profilePicture} />
                  <AvatarFallback>{selectedUser?.fullName?.slice(0,2).toUpperCase() || "UN"}</AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <h2 className='font-semibold truncate'>{selectedUser?.fullName}</h2>
                  <p className="text-xs text-gray-500 truncate">{selectedUser?.department}</p>
                </div>
              </div>

              {/* Messages */}
              <div className='flex-1 overflow-y-auto px-4 py-3'>
                <Messages selectedUser={selectedUser} />
              </div>

              {/* Input */}
              <div className='border-t px-4 py-3 bg-white flex items-center gap-2'>
                <Input
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  type="text"
                  className='flex-1 '
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && textMessage.trim()) {
                      sendMessageHandler(selectedUser?._id);
                    }
                  }}
                />
                <Button
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  disabled={!textMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </main>
          ) : (
            <main className='flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500'>
              <MessageCircleCode className='w-20 h-20 mb-4' />
              <h2 className='text-xl font-semibold mb-2'>Your messages</h2>
              <p>Send a message to start a conversation.</p>
            </main>
          )}
        </div>
    )
}

export default ChatPage;
