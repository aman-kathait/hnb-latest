// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import { setSelectedUser } from '@/redux/authSlice'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import { MessageCircleCode } from 'lucide-react'
// import Messages from './Messages'
// import axios from 'axios'
// import { setMessages } from '@/redux/chatSlice'

// const ChatPage = () => {
//   const [textMessage, setTextMessage] = useState("")
//   const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth)
//   const { onlineUsers, messages } = useSelector(store => store.chat)
//   const dispatch = useDispatch()

//   const sendMessageHandler = async (receiverId) => {
//     try {
//       const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       })
//       if (res.data.success) {
//         dispatch(setMessages([...messages, res.data.newMessage]))
//         setTextMessage("")
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     return () => {
//       dispatch(setSelectedUser(null))
//     }
//   }, [])

//   return (
//     <div className='flex flex-col md:flex-row h-screen overflow-hidden'>
//       {/* Sidebar */}
//       <aside className='w-full md:w-1/5 border-b md:border-b-0 md:border-r border-gray-300 flex flex-col mt-16 md:mt-0'>
//         <div className='px-4 py-4 border-b justify-center flex items-center bg-green-900 text-white rounded-b-lg'>
//           <h1 className='font-bold text-lg md:text-xl text-center'>{user?.fullName}</h1>
//         </div>
//         <div className='overflow-y-auto flex-1'>
//           {suggestedUsers.map((suggestedUser) => {
//             const isOnline = onlineUsers.includes(suggestedUser?._id)
//             return (
//               <div
//                 onClick={() => dispatch(setSelectedUser(suggestedUser))}
//                 className='flex gap-3 items-center p-3 hover:bg-green-100 cursor-pointer border-b border-gray-200'
//                 key={suggestedUser?._id}
//               >
//                 <Avatar className='w-10 h-10'>
//                   <AvatarImage src={suggestedUser?.profilePicture} />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//                 <div className='flex flex-col'>
//                   <span className='font-medium text-sm md:text-base'>{suggestedUser?.fullName}</span>
//                   <span className="text-xs font-semibold text-green-800">{suggestedUser?.department}</span>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </aside>

//       {/* Chat section */}
//       {
//         selectedUser ? (
//           <main className='flex-1 flex flex-col'>
//             {/* Header */}
//             <div className='flex items-center gap-3 px-4 py-3 border-b bg-white'>
//               <Avatar>
//                 <AvatarImage src={selectedUser?.profilePicture} />
//                 <AvatarFallback>CN</AvatarFallback>
//               </Avatar>
//               <div>
//                 <h2 className='font-semibold text-sm md:text-base'>{selectedUser?.fullName}</h2>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className='flex-1 overflow-y-auto px-2 py-2 bg-gray-100'>
//               <Messages selectedUser={selectedUser} />
//             </div>

//             {/* Input */}
//             <div className='border-t px-4 py-3 bg-white flex flex-col sm:flex-row items-center gap-2 sm:gap-0'>
//               <Input
//                 value={textMessage}
//                 onChange={(e) => setTextMessage(e.target.value)}
//                 type="text"
//                 className='flex-1 mr-0 sm:mr-2'
//                 placeholder="Type a message..."
//               />
//               <Button
//                 onClick={() => sendMessageHandler(selectedUser?._id)}
//                 disabled={!textMessage.trim()}
//               >
//                 Send
//               </Button>
//             </div>
//           </main>
//         ) : (
//           <main className='flex-1 flex flex-col items-center justify-center text-center p-4'>
//             <MessageCircleCode className='w-16 h-16 md:w-20 md:h-20 text-gray-400 mb-4' />
//             <h2 className='text-lg md:text-xl font-semibold'>Your messages</h2>
//             <p className='text-gray-600 text-sm md:text-base'>Send a message to start a conversation.</p>
//           </main>
//         )
//       }
//     </div>
//   )
// }

// export default ChatPage


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
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            <aside className='w-full md:w-1/5 border-r border-gray-300 flex flex-col ml-[20%] mt-16'>
                <div className='px-4 py-4 border-b justify-center flex items-center bg-green-900 text-white rounded-b-lg'>
                    <h1 className='font-bold text-xl'>{user?.fullName}</h1>
                </div>
                <div className='overflow-y-auto flex-1'>
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                className='flex gap-3 items-center p-3 hover:bg-green-100 cursor-pointer border-b border-gray-200'
                                key={suggestedUser?._id}
                            >
                                <Avatar className='w-10 h-10'>
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{suggestedUser?.fullName}</span>
                                    <span className="text-xs font-semibold text-green-800">
                                        {suggestedUser?.department}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </aside>

            {/* Chat section */}
            {
                selectedUser ? (
                    <main className='flex-1 flex flex-col'>
                        {/* Header */}
                        <div className='flex items-center gap-3 px-4 py-3 border-b bg-white'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className='font-semibold'>{selectedUser?.fullName}</h2>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className='flex-1 overflow-y-auto px-0 py-2 bg-gray-100'>
                            <Messages selectedUser={selectedUser} />
                        </div>

                        {/* Input */}
                        <div className='border-t px-4 py-3 bg-white flex items-center'>
                            <Input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                type="text"
                                className='flex-1 mr-2'
                                placeholder="Type a message..."
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
                    <main className='flex-1 flex flex-col items-center justify-center text-center p-4'>
                        <MessageCircleCode className='w-20 h-20 text-gray-400 mb-4' />
                        <h2 className='text-xl font-semibold'>Your messages</h2>
                        <p className='text-gray-600'>Send a message to start a conversation.</p>
                    </main>
                )
            }
        </div>
    )
}

export default ChatPage;