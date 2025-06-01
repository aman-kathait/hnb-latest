import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Calendar, Heart, MessageCircle, Download } from "lucide-react";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { likeEvent, unlikeEvent, updateEventInterest } from "@/redux/eventSlice";
import { toast } from "sonner";

const EventCard = ({ event }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isLiked = event.likes?.includes(user?._id);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  
  // Check if user is interested
  const isInterested = event.interestedUsers?.some(
    entry => entry.user === user?._id
  );
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM dd, yyyy");
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return "bg-blue-100 text-blue-800";
      case 'ongoing': return "bg-green-100 text-green-800";
      case 'completed': return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };
  
  const handleLike = async () => {
    try {
      const endpoint = isLiked ? 'dislike' : 'like';
      const response = await axios.get(`http://localhost:8000/api/v1/event/${event._id}/${endpoint}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        if (isLiked) {
          dispatch(unlikeEvent({ eventId: event._id, userId: user._id }));
        } else {
          dispatch(likeEvent({ eventId: event._id, userId: user._id }));
        }
      }
    } catch (error) {
      toast.error("Failed to update like status");
      console.error(error);
    }
  };
  
  // Add interest toggle handler
  const handleInterestToggle = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/event/${event._id}/interest`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(updateEventInterest({
          eventId: event._id,
          userId: user._id,
          isInterested: !isInterested
        }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update interest");
    } finally {
      setLoading(false);
    }
  };

  // Add report generation handler
  const handleGenerateReport = async () => {
    try {
      setReportLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/event/${event._id}/interest-report`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Interest report has been sent to your email");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report");
    } finally {
      setReportLoading(false);
    }
  };
  
  console.log("Event/Announcement props:", {
    id: event._id,
    interestedUsers: event.interestedUsers,
    userInterested: event.interestedUsers?.some(entry => entry.user === user?._id)
  });
  
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow rounded-xl">
      {event.image && (
        <div className="w-full max-h-80 overflow-hidden rounded-t-xl">
          <img 
            src={event.image} 
            alt={event.caption} 
            className="w-full object-contain"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={event.author?.profilePicture} alt={event.author?.username} />
              <AvatarFallback>{event.author?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{event.author?.fullName || event.author?.username}</p>
              <p className="text-xs text-gray-500">{event.author?.department}</p>
            </div>
          </div>
          
          <Badge className={getStatusColor(event.eventStatus)}>
            {event.eventStatus?.charAt(0).toUpperCase() + event.eventStatus?.slice(1) || "Upcoming"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <CardTitle className="text-lg">{event.caption}</CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
        
        {(event.startDate || event.endDate) && (
          <div className="flex items-center text-sm text-gray-500 space-x-1">
            <Calendar className="h-4 w-4 mr-1" />
            {event.startDate && formatDate(event.startDate)}
            {event.startDate && event.endDate && " - "}
            {event.endDate && formatDate(event.endDate)}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col pt-2 border-t gap-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1 px-2"
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{event.likes?.length || 0}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 px-2">
              <MessageCircle className="h-4 w-4" />
              <span>{event.comments?.length || 0}</span>
            </Button>
          </div>
          
          {user?.role === "faculty" && event.author?._id === user?._id && (
            <Button variant="outline" size="sm">Manage</Button>
          )}
        </div>

        {/* Interest and Report Buttons Row */}
        <div className="flex flex-wrap items-center gap-2 w-full">
          {/* Interest Toggle Button */}
          <Button 
            onClick={handleInterestToggle}
            disabled={loading}
            variant={isInterested ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-2 ${
              isInterested 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'border-green-600 text-green-600 hover:bg-green-50'
            }`}
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                {isInterested ? 'Interested' : 'Show Interest'}
                <span className="text-xs">
                  ({event.interestedUsers?.length || 0})
                </span>
              </>
            )}
          </Button>

          {/* Report Generation Button - Only visible for event creator */}
          {user?._id === event.author?._id && (
            <Button
              onClick={handleGenerateReport}
              disabled={reportLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              {reportLoading ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Get Interest Report
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
