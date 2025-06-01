import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import API_URL from '@/config/api';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const { selectedPost, posts } = useSelector(store => store.post);
  const { user } = useSelector(store => store.auth);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComments(selectedPost.comments || []);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const sendMessageHandler = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newComment = {
          ...res.data.comment,
          author: user,
        };
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);

        const updatedPosts = posts.map(post =>
          post._id === selectedPost._id ? { ...post, comments: updatedComments } : post
        );
        dispatch(setPosts(updatedPosts));

        toast.success(res.data.message);
        setText('');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/post/${selectedPost?._id}/comment/${commentId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedComments = comments.filter(c => c._id !== commentId);
        setComments(updatedComments);

        const updatedPosts = posts.map(post =>
          post._id === selectedPost._id ? { ...post, comments: updatedComments } : post
        );
        dispatch(setPosts(updatedPosts));

        toast.success('Comment deleted successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (!selectedPost) return null;

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-full md:max-w-2/3 sm:max-w-9xl p-2 flex flex-col sm:flex-row h-2/3 sm:h-2/3 justify-between"
      >
        {/* Left side: Image or Caption fallback */}
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          {selectedPost.image ? (
            <img
              src={selectedPost.image}
              alt="post_img"
              className="w-full h-48 sm:h-full object-cover sm:rounded-l-lg"
            />
          ) : selectedPost.caption ? (
            <div className="bg-[#DDEFE0] rounded-lg ">
              <div className="flex items-center gap-3 px-2 py-2">
              <Link>
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              
                <Link className="font-semibold text-sm">
                  {selectedPost?.author?.fullName}
                </Link>
              
              </div>
                <p className='text-sm p-2 mb-2'>
                    {selectedPost.caption}
                </p>
            </div>
          ) : (
            <div className="w-full h-48 sm:h-full flex items-center justify-center bg-gray-100 text-gray-400 sm:rounded-l-lg">
              No media or caption
            </div>
          )}
        </div>

        {/* Right side: Comments section */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-3 items-center">
              <Link>
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link className="font-semibold text-xs sm:text-sm">
                  {selectedPost?.author?.fullName}
                </Link>
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

          {/* Comment List */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-12rem)] sm:max-h-96 p-4">
            {comments.map((comment) => {
              const safeComment = {
                ...comment,
                author: comment.author || {},
                text: comment.text || '',
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

          {/* Add Comment */}
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
  );
};

export default CommentDialog;
