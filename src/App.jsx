import Signup from './components/Signup.jsx'
import MainLayout from './components/MainLayout.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Profile from './components/Profile.jsx'
import EditProfile from './components/EditProfile.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Posts from './components/Posts.jsx'
import Announcements from './components/Announcements.jsx'
import Error from './components/Error.jsx'
import ChatPage from './components/ChatPage.jsx'
import {io} from "socket.io-client";
import { use } from 'react'
import { setSocket } from './redux/socketSlice'
import { useEffect } from 'react'
import { setLikeNotification } from './redux/rtnSlice'
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import VerifyResetCode from "./components/auth/VerifyResetCode.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import useGetRTM from '@/hooks/useGetRTM';
import TermsAndConditions from './components/TermsAndCondition.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import API_URL from './config/api';
const SOCKET_URL = API_URL;
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
  useEffect(() => {
    if(user) {
      // Use API_URL instead of SOCKET_URL if you changed the import
      const socketio = io(API_URL, {
        query: {
          userId: user._id
        },
        transports: ["websocket"],
      });
      
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });
      
      dispatch(setSocket(socketio));
      
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if(socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App