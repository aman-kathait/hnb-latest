import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* User Header */}
      <div className="flex flex-col items-center justify-center py-4 border-b bg-green-50">
        <Avatar className="h-16 w-16 mb-2">
          <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
          <AvatarFallback>
            {selectedUser?.fullName
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{selectedUser?.fullName}</span>
        <Link to={`/profile/${selectedUser?._id}`}>
          <Button
            className="h-8 mt-2 bg-blue-600 text-white"
            variant="secondary "
          >
            View profile
          </Button>
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-1 rounded-lg max-w-[75%] break-words shadow-sm ${
                  msg.senderId === user?._id
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500">No messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
