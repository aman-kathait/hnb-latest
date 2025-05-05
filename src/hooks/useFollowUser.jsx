import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile, updateCurrentUser, setSuggestedUsers } from '@/redux/authSlice';

const useFollowUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const followOrUnfollow = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userId}`, {}, {
        withCredentials: true
      });
      
      // Refresh user profile data
      const profileRes = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`, {
        withCredentials: true
      });
      
      // Also get updated current user data to update following list
      const currentUserRes = await axios.get(`http://localhost:8000/api/v1/user/${user._id}/profile`, {
        withCredentials: true
      });
      
      // Get refreshed suggested users
      const suggestedUsersRes = await axios.get('http://localhost:8000/api/v1/user/suggested', {
        withCredentials: true
      });
      
      if (profileRes.data.success) {
        dispatch(setUserProfile(profileRes.data.user));
      }
      
      if (currentUserRes.data.success) {
        dispatch(updateCurrentUser(currentUserRes.data.user));
      }
      
      if (suggestedUsersRes.data.success) {
        dispatch(setSuggestedUsers(suggestedUsersRes.data.users));
      }
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { followOrUnfollow, loading, error };
};

export default useFollowUser;