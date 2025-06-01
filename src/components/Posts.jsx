import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-8 px-4">
      {posts?.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <div className="flex flex-col justify-center items-center h-[50vh] text-2xl font-semibold text-gray-600">
          <p className="mb-4">No Posts Yet</p>
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

export default Posts;
