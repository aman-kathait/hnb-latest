import Signup from './components/signup'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Login from './components/Login'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import { useDispatch, useSelector } from 'react-redux'


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
      }
      // {
      //   path: "/chat",
      //   element: <ChatPage />
      // }
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
])

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App 