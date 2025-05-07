import { setUserProfiles } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfiles = (refreshFlag) => {
  const dispatch = useDispatch();

  const fetchUserProfiles = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/suggested", {withCredentials: true});
      
      if (res.data.success) {
        dispatch(setUserProfiles(res.data.users)); 
      }
      console.log("API Response from useGetUserProfiles:", res.data);
    } catch (error) {
      console.error("Failed to fetch user profiles:", error);
    }
  };

  useEffect(() => {
    fetchUserProfiles();
  }, [refreshFlag]);

  return { refreshUserProfiles: fetchUserProfiles };
};

export default useGetUserProfiles;
