import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setEvents, setLoading, setError } from '@/redux/eventSlice';
import API_URL from '@/config/api';

const useGetAllEvents = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        dispatch(setLoading(true));
        
        // Use the correct endpoint from your backend
        const response = await axios.get(`${API_URL}/api/v1/event/all`, {
          withCredentials: true
        });

        if (response.data.success) {
          dispatch(setEvents(response.data.events));
        } else {
          dispatch(setError('Failed to fetch events'));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to fetch events'));
      }
    };

    fetchEvents();
  }, [dispatch]);
};

export default useGetAllEvents;