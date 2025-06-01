import Signup from './components/signup'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Login from './components/Login'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import { useDispatch, useSelector } from 'react-redux'
import Posts from './components/Posts'
import Announcements from './components/Announcements'
import Error from './components/Error'
import ChatPage from './components/ChatPage'
import {io} from "socket.io-client";
import { use } from 'react'
import { setSocket } from './redux/socketSlice'
import { useEffect } from 'react'
import { setLikeNotification } from './redux/rtnSlice'
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyResetCode from "./components/auth/VerifyResetCode";
import ResetPassword from "./components/auth/ResetPassword";
import useGetRTM from '@/hooks/useGetRTM';
import TermsAndConditions from './components/TermsAndCondition'
import PrivacyPolicy from './components/PrivacyPolicy'
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
        element: <Home />,
        children: [
          {
            index: true,
            element: <Posts />
          },
          {
            path: "announcements",
            element: <Announcements />
          }
        ]
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
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/verify-reset-code',
    element: <VerifyResetCode />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '*',
    element:<Error/>
  },
  {
    path:'terms',
    element:<TermsAndConditions />
  },
  {
    path:'privacy',
    element:<PrivacyPolicy />
  }
])

function App() {
  const {user} = useSelector(store=>store.auth);
  const {socket} = useSelector(store=>store.socketio);
  const dispatch = useDispatch();
  useGetRTM();
  useEffect(()=>{
    if(user){
      const socketio=io("http://localhost:8000",{
        query:{
          userId:user._id
        },
        transports: ["websocket"],
      });
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });
      dispatch(setSocket(socketio));
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