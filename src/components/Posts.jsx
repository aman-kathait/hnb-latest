import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  return (
    <div className="mt-12 flex-1 my-8 flex flex-col items-center p-3 md:pl-[25%]">
      {posts?.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <div className="flex justify-center items-center h-[50vh] text-2xl font-semibold bg-amber-600">
          No Posts Yet
          <div className="flex flex-col space-y-3 bg-amber-600">
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

export default Posts;
