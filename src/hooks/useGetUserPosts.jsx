import { useState, useEffect } from "react";
import axios from "axios";

const useGetUserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/api/v1/post/user/${userId}`, {
          withCredentials: true
        });

        if (res.data.success) {
          console.log(`Fetched ${res.data.posts.length} posts for user ${userId}`);
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  return { posts, loading, error };
};

export default useGetUserPosts;