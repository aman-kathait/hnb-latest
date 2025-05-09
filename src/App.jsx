import Signup from './components/signup'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Login from './components/Login'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import { useDispatch, useSelector } from 'react-redux'
import Announcement from './components/Announcement'
import Error from './components/Error'
import ChatPage from './components/ChatPage'
import {io} from "socket.io-client";
import { use } from 'react'
import { setSocket } from './redux/socketSlice'
import { useEffect } from 'react'
import { setLikeNotification } from './redux/rtnSlice'
function ProtectedRoute({ children }) {
  const { user } = useSelector((store) => store.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/profile/:id",
        element: <Profile />
      },
      {
        path: "/account/edit",
        element: <EditProfile />
      },
      {
        path: "/announcements",
        element: <Announcement />
      },
      {
        path: "/chat",
        element: <ChatPage />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '*',
    element:<Error/>
  },
])

function App() {
  const {user} = useSelector(store=>store.auth);
  const {socket} = useSelector(store=>store.socketio);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(user){
      const socketio=io("http://localhost:8000",{
        query:{
          userId:user._id
        },
        transports: ["websocket"],
      });
      // dispatch(setSocket(socketio));
      // socketio.on('getOnlineUsers',(onlineUsers)=>{
      //   dispatch(setOnlineUsers(onlineUsers));
      // });
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });
      return ()=>{
        socketio.close();
        dispatch(setSocket(null));
      }
    }else if(socket){
      socket.close();
      dispatch(setSocket(null));
    }
  },[user,dispatch])
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App 