"use client"
import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, X } from 'lucide-react'; // Added X icon
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import API_URL from '@/config/api';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const removeImageHandler = () => {
    setFile("");
    setImagePreview("");
    // Reset the file input
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  }

  const createPostHandler = async (e) => {
    if (!caption.trim() && !imagePreview) {
      toast.error("Please add a caption or select an image");
      return;
    }

    const formData = new FormData();
    if (caption.trim()) formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/post/addpost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        // Reset form
        setCaption("");
        removeImageHandler();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.fullName}</h1>
            <span className='text-gray-600 text-xs'>{user?.department}</span>
          </div>
        </div>
        <Textarea 
          value={caption} 
          onChange={(e) => setCaption(e.target.value)} 
          className="focus-visible:ring-transparent border-none" 
          placeholder="Write a caption..." 
        />
        {
          imagePreview && (
            <div className='w-full h-64 flex items-center justify-center relative'>
              <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
              <button 
                onClick={removeImageHandler}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          )
        }
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
          loading ? (
            <Button disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} className="w-full">
              Post
            </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost;