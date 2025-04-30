import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='mt-12 flex-1 my-8 flex flex-col items-center p-3 md:pl-[20%]'> 
      <Posts/>
    </div>
  )
}

export default Feed