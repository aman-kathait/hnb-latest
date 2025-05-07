import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = (refreshFlag) => {
    const dispatch = useDispatch();
    
    const fetchSuggestedUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/suggested', { withCredentials: true });
            if (res.data.success) { 
                dispatch(setSuggestedUsers(res.data.users));
            }
            // console.log("API Response from useGetSuggestedUsers:", res.data);
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        fetchSuggestedUsers();
    }, [refreshFlag]);
    
    return { refreshSuggestedUsers: fetchSuggestedUsers };
};

export default useGetSuggestedUsers;