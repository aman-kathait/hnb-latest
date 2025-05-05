import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4'>
      <h1 className='text-5xl font-bold text-red-600 mb-4'>404 - Page Not Found</h1>
      <p className='text-lg text-gray-700 mb-6'>Oops! The page you are looking for does not exist.</p>
      <button 
        onClick={handleGoHome}
        className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300'
      >
        Go to Home
      </button>
    </div>
  )
}

export default Error
