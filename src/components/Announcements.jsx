import React from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAllEvents from "@/hooks/useGetAllEvents";
import EventCard from "./EventCard";

const Announcements = () => {
  useGetAllEvents();
  const { events, loading, error } = useSelector((store) => store.event);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-0 flex flex-col space-y-6 py-8">
        {[1, 2, 3].map((_, i) => (
          <Skeleton
            key={i}
            className="h-28 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-0 flex justify-center items-center h-[50vh] text-red-500">
        Error loading events: {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0">
      <h1 className="text-2xl font-bold mb-6">Events & Announcements</h1>
      
      {events.length > 0 ? (
        <div className="flex flex-col space-y-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[50vh] text-xl font-semibold text-gray-500">
          No events or announcements yet
        </div>
      )}
    </div>
  );
};

export default Announcements;
