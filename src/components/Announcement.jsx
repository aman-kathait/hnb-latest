"use client"
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send, MessageSquareText } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setAnnouncements, setSelectedAnnouncement } from '@/redux/announcementSlice' // TODO: Create this slice
import { Badge } from './ui/badge'

const Announcement = ({ announcement }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { announcements } = useSelector(store => store.announcement); // TODO: Add to store
    const [liked, setLiked] = useState(announcement.likes.includes(user?._id) || false);
    const [announcementLike, setAnnouncementLike] = useState(announcement.likes.length);
    const [comment, setComment] = useState(announcement.comments);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    // TODO: Update API endpoint to announcement-specific endpoints
    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/announcement/${announcement._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLikes = liked ? announcementLike - 1 : announcementLike + 1;
                setAnnouncementLike(updatedLikes);
                setLiked(!liked);

                const updatedAnnouncementData = announcements.map(a =>
                    a._id === announcement._id ? {
                        ...a,
                        likes: liked ? a.likes.filter(id => id !== user._id) : [...a.likes, user._id]
                    } : a
                );
                dispatch(setAnnouncements(updatedAnnouncementData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // TODO: Update API endpoint to announcement-specific endpoints
    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/announcement/${announcement._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedAnnouncementData = announcements.map(a =>
                    a._id === announcement._id ? { ...a, comments: updatedCommentData } : a
                );

                dispatch(setAnnouncements(updatedAnnouncementData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // TODO: Update API endpoint to announcement-specific endpoints
    const deleteAnnouncementHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/announcement/delete/${announcement?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedAnnouncementData = announcements.filter((announcementItem) => announcementItem?._id !== announcement?._id);
                dispatch(setAnnouncements(updatedAnnouncementData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messsage);
        }
    }

    // TODO: Update API endpoint to announcement-specific endpoints
    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/announcement/${announcement?._id}/bookmark`, {withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto sm:max-w-xl p-4 rounded-2xl shadow-lg sm:ml-24'>
            {/* Announcement Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div>
                        <Avatar className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-sm flex items-center justify-center">
                            <AvatarImage src={announcement.author?.profilePicture} alt="announcement_image" />
                            <AvatarFallback>AN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-sm font-semibold text-blue-900'>{announcement.author?.username}</h1>
                            {user?._id === announcement.author._id && <Badge variant="secondary">Author</Badge>}
                            {/* Add admin badge if needed */}
                            {/* {announcement.author?.isAdmin && <Badge variant="default">Admin</Badge>} */}
                        </div>
                        <div className='text-xs text-gray-500'>
                            10 minutes ago
                            {/* TODO: Use actual announcement date */}
                            {/* {format(new Date(announcement.createdAt), 'MMM d, yyyy')} */}
                        </div>
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {announcement?.author?._id !== user?._id && 
                            <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Report</Button>
                        }
                        <Button variant='ghost' className="cursor-pointer w-fit">Save Announcement</Button>
                        {(user && user?._id === announcement?.author._id) && 
                            <Button onClick={deleteAnnouncementHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>

            {/* Announcement Title - Added for announcements */}
            {announcement.title && (
                <h2 className='text-lg font-bold my-2 text-blue-800'>
                    {announcement.title}
                </h2>
            )}

            {/* Announcement Content */}
            {announcement.content && (
                <p className='text-sm my-2'>
                    {announcement.content}
                </p>
            )}

            {/* Image (if exists) */}
            {announcement.image && (
                <img
                    className='w-full rounded-lg object-cover h-80 mt-2'
                    src={announcement.image}
                    alt="announcement_img"
                />
            )}

            {/* Announcement Actions */}
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4 mt-4 text-gray-600 text-sm'>
                    {liked ? 
                        <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : 
                        <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
                    <MessageSquareText 
                        onClick={() => {
                            dispatch(setSelectedAnnouncement(announcement));
                            setOpen(true);
                        }} 
                        className='cursor-pointer hover:text-gray-600' 
                    />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
            </div>

            {/* Likes count */}
            <span className='font-medium block mb-2'>{announcementLike} likes</span>

            {/* Comments section */}
            {comment.length > 0 && (
                <span 
                    onClick={() => {
                        dispatch(setSelectedAnnouncement(announcement));
                        setOpen(true);
                    }} 
                    className='cursor-pointer text-sm text-gray-400'
                >
                    View all comments
                </span>
            )}

            <CommentDialog open={open} setOpen={setOpen} />

            {/* Add comment */}
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full'
                />
                {text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>}
            </div>
        </div>
    )
}

export default Announcement;