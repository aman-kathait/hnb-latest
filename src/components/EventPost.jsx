"use client"

import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns'
import { addEvent } from '@/redux/eventSlice'

const EventPost = ({ open, setOpen }) => {
  const imageRef = useRef()
  const [file, setFile] = useState("")
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch()

  const resetForm = () => {
    setCaption("")
    setFile("")
    setImagePreview("")
    setStartDate("")
    setEndDate("")
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

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value
    const today = format(new Date(), 'yyyy-MM-dd')

    if (selectedDate === "") {
      setStartDate("")
      setEndDate("") // Clear end date when start date is cleared
      return
    }
    
    if (selectedDate < today) {
      toast.error("Start date cannot be in the past")
      return
    }
    
    setStartDate(selectedDate)
    
    // Reset end date if it's before the new start date
    if (endDate && endDate < selectedDate) {
      setEndDate("")
    }
  }

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value

    if (selectedDate === "") {
      setEndDate("") // Simple clear for end date
      return
    }
    
    if (!startDate) {
      toast.error("Please select start date first")
      return
    }
    
    if (selectedDate < startDate) {
      toast.error("End date cannot be before start date")
      return
    }
    
    setEndDate(selectedDate)
  }
  

  const createPostHandler = async () => {
    // Validate that at least description or image is provided
    if (!caption.trim() && !imagePreview) {
      toast.error("Please add at least a caption or image")
      return
    }

    // Validate dates if provided
    if (startDate && endDate) {
      if (isBefore(parseISO(endDate), parseISO(startDate))) {
        toast.error("End date cannot be before start date")
        return
      }
    }

    const formData = new FormData()
    if (caption.trim()) formData.append("caption", caption)
    if (file) formData.append("image", file)
    if (startDate) formData.append("startDate", startDate)
    if (endDate) formData.append("endDate", endDate)
    
    // Mark this as an event post
    formData.append("isEvent", "true")
    
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/event/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      console.log("Response:", res.data); // Add this for debugging
      
      if (res.data.success) {
        // Make sure you're using the correct property name
        if (res.data.event) {
          dispatch(addEvent(res.data.event));
          toast.success(res.data.message);
          setOpen(false);
          resetForm();
        } else {
          console.error("Event missing from response:", res.data);
          toast.error("Event created but data invalid");
        }
      } else {
        toast.error(res.data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Calculate min dates for date inputs
  const today = format(new Date(), 'yyyy-MM-dd')
  const minEndDate = startDate || today

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
          placeholder="Describe your event..."
        />

        {/* Date Selection Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date (optional)
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              min={today}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date (optional)
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              min={minEndDate}
              disabled={!startDate}
              className="w-full p-2 border rounded-md disabled:opacity-50"
            />
          </div>
        </div>

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

// In your eventSlice.js
addEvent: (state, action) => {
  try {
    // Safely add the new event to the beginning of the array
    const newEvent = action.payload;
    if (newEvent && newEvent._id) { // Make sure it's a valid event
      state.events = [newEvent, ...state.events];
    } else {
      console.error("Invalid event data:", newEvent);
    }
  } catch (error) {
    console.error("Error in addEvent reducer:", error);
  }
}