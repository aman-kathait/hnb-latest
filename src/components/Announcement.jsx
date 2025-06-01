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
    const [isInterested, setIsInterested] = useState(
        announcement.interestedUsers?.some(entry => entry.user === user?._id) || false
    );
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

    // Update this handler in your Announcement.jsx
    const handleInterestToggle = async () => {
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/event/${announcement._id}/interest`, // Note: Using "event" instead of "announcement"
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsInterested(!isInterested);
                
                // Update Redux store
                dispatch(updateAnnouncementInterest({
                    announcementId: announcement._id,
                    userId: user._id,
                    isInterested: !isInterested
                }));
                
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update interest");
        }
    };

    // Add this handler for generating report
    const handleGenerateReport = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8000/api/v1/announcement/${announcement._id}/report`,
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("Report has been sent to your email");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate report");
        }
    };

    console.log("Announcement props:", {
        id: announcement._id,
        interestedUsers: announcement.interestedUsers,
        isCurrentUserInterested: announcement.interestedUsers?.some(entry => entry.user === user?._id),
        isCreator: user?._id === announcement.author._id
    });

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
            <div className='flex items-center justify-between mb-4'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full'
                />
                {text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>}
            </div>

            {/* Interest & Report Buttons Section - FIXED SECTION */}
            <div className='flex flex-wrap items-center gap-3 mt-4 border-t pt-3'>
                {/* Interest Toggle Button */}
                <Button 
                    onClick={handleInterestToggle}
                    variant={isInterested ? "default" : "outline"}
                    className={`flex items-center gap-2 ${
                        isInterested 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'border-green-600 text-green-600 hover:bg-green-50'
                    }`}
                >
                    {isInterested ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Interested
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Show Interest
                        </>
                    )}
                    <span className="text-xs ml-1">
                        ({announcement.interestedUsers?.length || 0})
                    </span>
                </Button>

                {/* Report Generation Button - Only visible for announcement creator */}
                {user?._id === announcement.author._id && (
                    <Button
                        onClick={handleGenerateReport}
                        variant="outline"
                        className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Get Interest Report
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Announcement;