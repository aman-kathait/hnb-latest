import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { MessageCircle, MoreHorizontal, Send, MessageSquareText } from 'lucide-react'
import { Bookmark, BookmarkCheck, } from 'lucide-react'; 

import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import RoleBadge from "./RoleBadge";
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { Link } from 'react-router-dom'
import useFollowUser from '@/hooks/useFollowUser';
import API_URL from '@/config/api';
const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [bookmarked, setBookmarked] = useState(Array.isArray(post.bookmarks) && post.bookmarks.includes(user?._id));

    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();
    const { followOrUnfollow, loading: followLoading } = useFollowUser();
    const [loadingStates, setLoadingStates] = useState({});
    
    if (!post || !post.author) {
        return (
            <div className="my-8 w-full max-w-sm mx-auto sm:max-w-xl p-4 rounded-2xl shadow-lg sm:ml-24 text-center text-gray-500">      
                Post data is incomplete
            </div>
        );
    }
     const handleUnfollow = async () => {
        try {
            const result = await followOrUnfollow(post.author._id);
            if (result.success) {
                toast.success(`You have unfollowed ${post.author.fullName}`);
            }
        } catch (err) {
            toast.error('Failed to unfollow user');
        }
    };

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`${API_URL}/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${API_URL}/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messsage);
        }
    }
     const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/v1/post/${post?._id}/bookmark`, {withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Format timestamp
    const formatTimeAgo = (dateString) => {
        if (!dateString) return "recently";
        
        const date = parseISO(dateString);
        const timeAgo = formatDistanceToNow(date, { addSuffix: true });
        
        // For posts older than a week, show the actual date
        const isOlderThanAWeek = Date.now() - date.getTime() > 7 * 24 * 60 * 60 * 1000;
        
        if (isOlderThanAWeek) {
            return format(date, 'MMM d, yyyy');
        }
        
        return timeAgo;
    };

    return (
        <div className='my-8 w-full max-w-sm mx-auto sm:max-w-xl p-4 rounded-2xl shadow-lg sm:m-4'>
            {/* Post Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div>
                        <Avatar className="w-10 h-10 rounded-full bg-green-500 text-white font-bold text-sm flex items-center justify-center">
                            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-sm font-semibold text-green-900'>
                                <Link to={`/profile/${post.author?._id}`}>{post.author?.fullName}</Link>
                            </h1>       
                            {user?._id === post.author?._id && <Badge variant="secondary">You</Badge> }           
                            {<RoleBadge role={post.author?.role} className="text-xs"/>}
                        </div>
                        <div className='text-xs text-gray-500'>
                            {formatTimeAgo(post.createdAt)}
                        </div>
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {post?.author?._id !== user?._id && 
                            <Button 
                                onClick={handleUnfollow} 
                                variant='ghost' 
                                className="cursor-pointer w-fit text-[#ED4956] font-bold"
                                disabled={followLoading}
                            >
                                {followLoading ? 'Processing...' : 'Unfollow'}
                            </Button>
                        }
                        
                        {user && user?._id === post?.author._id && 
                            <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>

            {/* Caption (always rendered to maintain consistent spacing) */}
            {post.caption && (
                <p className='text-sm pt-4 '>
                    {post.caption}
                </p>
            )}

            {/* Image (if exists) */}
            {post.image && (
                <img
                    className='w-full rounded-lg object-cover h-80 mt-2'
                    src={post.image}
                    alt="post_img"
                />
            )}

            {/* Post Actions */}
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4 mt-4 text-gray-600 text-sm'>
                    {liked ? 
                        <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : 
                        <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
                    <MessageSquareText 
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }} 
                        className='cursor-pointer hover:text-gray-600' 
                    />
                </div>
                {
                    bookmarked ?
                    <BookmarkCheck onClick={bookmarkHandler} className='cursor-pointer text-gray-600' /> : 
                    <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' fill="none" />
                }
                {/* <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' /> */}
            </div>

            {/* Likes count */}
            <span className='font-medium block mb-2'>{postLike} likes</span>

            {/* Comments section */}
            {comment.length > 0 && (
                <span 
                    onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} 
                    className='cursor-pointer text-sm text-gray-400'
                >
                    View all comments
                </span>
            )}

            <CommentDialog open={open} setOpen={setOpen} post={post} />


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

export default Post;