"use client"

import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2, X } from 'lucide-react' // Removed CalendarIcon import
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'
// Removed date-fns and calendar-related imports

const EventPost = ({ open, setOpen }) => {
  const imageRef = useRef()
  const [file, setFile] = useState("")
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch()

  const resetForm = () => {
    setCaption("")
    setFile("")
    setImagePreview("")
    if (imageRef.current) {
      imageRef.current.value = ""
    }
  }

  const removeImageHandler = () => {
    setFile("")
    setImagePreview("")
    if (imageRef.current) {
      imageRef.current.value = ""
    }
  }

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Only image files are allowed.")
        return
      }
      setFile(file)
      const dataUrl = await readFileAsDataURL(file)
      setImagePreview(dataUrl)
    }
  }

  const createPostHandler = async () => {
    if (!caption.trim() && !imagePreview) {
      toast.error("Please add at least a caption or image")
      return
    }

    const formData = new FormData()
    if (caption.trim()) formData.append("caption", caption)
    if (file) formData.append("image", file)
    
    // TODO: Change API endpoint to your event-specific endpoint
    // Example: '/api/v1/event/addevent' instead of '/api/v1/post/addpost'
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      
      if (res.data.success) {
        // TODO: You might want to create a separate action for events
        // like setEvents instead of setPosts if storing in different table
        dispatch(setPosts([res.data.post, ...posts]))
        toast.success(res.data.message)
        setOpen(false)
        resetForm()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) resetForm()
      setOpen(val)
    }}>
      <DialogContent 
        onInteractOutside={() => {
          resetForm()
          setOpen(false)
        }}
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className='text-center font-semibold'>Create Event Post</DialogHeader>

        <div className='flex gap-3 items-center'>
          <Avatar className="w-10 h-10 rounded-full">
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='text-base font-medium text-gray-900'>{user?.username}</h1>
            <span className='text-gray-600 text-sm'>Department.</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border text-lg"
          placeholder="What's on your mind?"
        />

        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center relative'>
            <img 
              src={imagePreview} 
              alt="preview_img" 
              className='object-cover h-full w-full rounded-md'
            />
            <button
              onClick={removeImageHandler}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              aria-label="Remove image"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <input 
          ref={imageRef} 
          type='file' 
          className='hidden' 
          onChange={fileChangeHandler} 
          accept="image/*"
        />
        <Button 
          onClick={() => imageRef.current.click()} 
          className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'
          variant={imagePreview ? "outline" : "default"}
        >
          {imagePreview ? "Change Image" : "Select from computer"}
        </Button>

        {(caption.trim() || imagePreview) && (
          <Button
            onClick={createPostHandler}
            type="submit"
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Posting...
              </>
            ) : "Post Event"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EventPost