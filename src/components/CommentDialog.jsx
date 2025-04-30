import React from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import Comment from './Comment'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'

const CommentDialog = ({open, setOpen}) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const { user} = useSelector(store => store.auth); // Get current user from Redux store
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Initialize comments when selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      setComments(selectedPost.comments || []);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  }

  const sendMessageHandler = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`, 
        { text }, 
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.data.success) {
        // Update local comments state immediately for responsive UI
        const newComment = {
          ...res.data.comment,
          author: user// Add author details from current user
        };
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        
        // Update Redux store to keep data consistent
        const updatedPosts = posts.map(post => 
          post._id === selectedPost._id 
            ? { ...post, comments: updatedComments } 
            : post
        );
        dispatch(setPosts(updatedPosts));
        
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment/${commentId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update local comments state
        const updatedComments = comments.filter(c => c._id !== commentId);
        setComments(updatedComments);
        
        // Update Redux store
        const updatedPosts = posts.map(post => 
          post._id === selectedPost._id 
            ? { ...post, comments: updatedComments } 
            : post
        );
        dispatch(setPosts(updatedPosts));
        
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-full md:max-w-2/3 sm:max-w-9xl p-2 flex flex-col sm:flex-row h-2/3 sm:h-2/3 justify-between"
      >
        {/* Image Section (unchanged) */}
        <div className="w-full sm:w-1/2">
          <img
            src={selectedPost?.image}
            alt="post_img"
            className="w-full h-48 sm:h-full object-cover sm:rounded-l-lg"
          />
        </div>

        {/* Comments Section */}
        <div className="flex-1 flex flex-col justify-between">
          {/* User Info and Options (unchanged) */}
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-3 items-center">
              <Link>
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture}/>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link className="font-semibold text-xs sm:text-sm">{selectedPost?.author?.username}</Link>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center text-sm text-center">
                <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                  Unfollow
                </div>
                <div className="cursor-pointer w-full">Add to favorites</div>
              </DialogContent>
            </Dialog>
          </div>
          <hr />

          {/* Updated Comments List */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-12rem)] sm:max-h-96 p-4">
            {comments.map((comment) => {
              // Ensure comment has the required structure
              const safeComment = {
                ...comment,
                author: comment.author || {}, // Ensure author exists
                text: comment.text || ''      // Ensure text exists
              };

            return (
              <Comment 
                key={safeComment._id} 
                comment={safeComment} 
                userId={user?._id} 
                onDelete={handleDeleteComment}
              />
              );
            })}
</div>

          {/* Add Comment Input */}
          <div className="p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={changeEventHandler}
                placeholder="Add a comment.."
                className="w-full outline-none border text-xs sm:text-sm border-gray-300 p-2 rounded"
                onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler()}
              />
              <Button
                disabled={!text.trim() || loading}
                onClick={sendMessageHandler}
                variant="outline"
                className="text-blue-600 hover:text-blue-800"
              >
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog;