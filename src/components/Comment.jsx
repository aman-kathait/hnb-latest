import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({ comment, userId, onDelete }) => {
    // Safely check if author exists and get properties with defaults
    const author = comment?.author || {};
    const isAuthor = author._id === userId;
  
    return (
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.profilePicture || ''} />
            <AvatarFallback>
              {author.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">
              {author.fullName || 'Unknown User'}
            </p>
            <p className="text-sm">{comment.text}</p>
          </div>
        </div>
        {isAuthor && (
          <button 
            onClick={() => onDelete(comment._id)}
            className="text-red-500 text-xs hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    );
  };

export default Comment