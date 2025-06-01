import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  loading: false,
  error: null,
  selectedEvent: null
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    addEvent: (state, action) => {
      state.events = [action.payload, ...state.events];
    },
    updateEvent: (state, action) => {
      const updatedEvent = action.payload;
      state.events = state.events.map(event => 
        event._id === updatedEvent._id ? updatedEvent : event
      );
      if (state.selectedEvent?._id === updatedEvent._id) {
        state.selectedEvent = updatedEvent;
      }
    },
    deleteEvent: (state, action) => {
      const eventId = action.payload;
      state.events = state.events.filter(event => event._id !== eventId);
      if (state.selectedEvent?._id === eventId) {
        state.selectedEvent = null;
      }
    },
    likeEvent: (state, action) => {
      const { eventId, userId } = action.payload;
      state.events = state.events.map(event => {
        if (event._id === eventId) {
          // Add userId to likes if not already present
          if (!event.likes.includes(userId)) {
            return {
              ...event,
              likes: [...event.likes, userId]
            };
          }
        }
        return event;
      });
      
      if (state.selectedEvent?._id === eventId) {
        if (!state.selectedEvent.likes.includes(userId)) {
          state.selectedEvent = {
            ...state.selectedEvent,
            likes: [...state.selectedEvent.likes, userId]
          };
        }
      }
    },
    unlikeEvent: (state, action) => {
      const { eventId, userId } = action.payload;
      state.events = state.events.map(event => {
        if (event._id === eventId) {
          return {
            ...event,
            likes: event.likes.filter(id => id !== userId)
          };
        }
        return event;
      });
      
      if (state.selectedEvent?._id === eventId) {
        state.selectedEvent = {
          ...state.selectedEvent,
          likes: state.selectedEvent.likes.filter(id => id !== userId)
        };
      }
    },
    updateEventInterest: (state, action) => {
      const { eventId, userId, isInterested } = action.payload;
      
      // Update events array
      state.events = state.events.map(event => {
        if (event._id === eventId) {
          let updatedInterestedUsers = [...(event.interestedUsers || [])];
          
          if (isInterested) {
            // Add the user if not already interested
            if (!updatedInterestedUsers.some(entry => entry.user === userId)) {
              updatedInterestedUsers.push({ 
                user: userId, 
                timestamp: new Date().toISOString() 
              });
            }
          } else {
            // Remove the user if interested
            updatedInterestedUsers = updatedInterestedUsers.filter(
              entry => entry.user !== userId
            );
          }
          
          return { ...event, interestedUsers: updatedInterestedUsers };
        }
        return event;
      });
      
      // Also update selectedEvent if it matches
      if (state.selectedEvent && state.selectedEvent._id === eventId) {
        let updatedInterestedUsers = [...(state.selectedEvent.interestedUsers || [])];
        
        if (isInterested) {
          if (!updatedInterestedUsers.some(entry => entry.user === userId)) {
            updatedInterestedUsers.push({ 
              user: userId, 
              timestamp: new Date().toISOString() 
            });
          }
        } else {
          updatedInterestedUsers = updatedInterestedUsers.filter(
            entry => entry.user !== userId
          );
        }
        
        state.selectedEvent = { 
          ...state.selectedEvent, 
          interestedUsers: updatedInterestedUsers 
        };
      }
    }
  }
});

export const { 
  setEvents, 
  setLoading, 
  setError, 
  setSelectedEvent,
  addEvent,
  updateEvent,
  deleteEvent,
  likeEvent,
  unlikeEvent,
  updateEventInterest
} = eventSlice.actions;

export default eventSlice.reducer;