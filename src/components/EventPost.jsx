"use client"

import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2, Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const DatePickerField = ({ label, date, setDate }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  </div>
)

const EventPost = ({ open, setOpen }) => {
  const imageRef = useRef()
  const [file, setFile] = useState("")
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch()

  const resetForm = () => {
    setCaption("")
    setFile("")
    setImagePreview("")
    setStartDate(null)
    setEndDate(null)
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
    console.log("Start Date:", startDate)
    console.log("End Date:", endDate)
    const formData = new FormData()
    formData.append("caption", caption)
    if (startDate) formData.append("startDate", startDate.toISOString())
    if (endDate) formData.append("endDate", endDate.toISOString())
    if (file) formData.append("image", file)

    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      if (res.data.success) {
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
    }} modal={false}>
      <DialogContent onInteractOutside={() => {
        resetForm()
        setOpen(false)
      }}>
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

        <DatePickerField label="Event Start Date" date={startDate} setDate={setStartDate} />
        <DatePickerField label="Event End Date" date={endDate} setDate={setEndDate} />

        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center'>
            <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
          </div>
        )}

        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>
          Select from computer
        </Button>

        {imagePreview && (
          <Button
            onClick={createPostHandler}
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Posting...
              </>
            ) : "Post"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EventPost
