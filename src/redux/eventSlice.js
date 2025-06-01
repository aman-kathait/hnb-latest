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
  unlikeEvent
} = eventSlice.actions;

export default eventSlice.reducer;