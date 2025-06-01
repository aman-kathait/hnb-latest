import React from "react";
import Announcement from "./Announcement";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
const Announcements = () => {
  // uncomment following code to get announcements from redux store
  const { announcements } = useSelector((store) => store.announcement);
  return (
    <div>
       {announcements?.length > 0 ? (
        announcements.map((announcement) => <Announcement key={announcement._id} announcement={announcement} />)
      ) : ( 
        <div className="flex justify-center items-center h-[50vh] text-2xl font-semibold">
          No Announcements Yet
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
       )}  
    </div>
  );
};

export default Announcements;