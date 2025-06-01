import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // user object will contain resumeUrl and resumeName
  suggestedUsers: [],
  userProfile: null,
  selectedUser: null,
  userProfiles: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      // This will now include resumeUrl and resumeName from the payload
    },
    setSuggestedUsers: (state, action) => {
      //  console.log("Dispatching setUserProfiles with payload:", action.payload);
      state.suggestedUsers = action.payload;
    },
    //New hook testing for all user profiles.
    setUserProfiles: (state, action) => {
      console.log("Dispatching setUserProfiles with payload:", action.payload);
      state.userProfiles = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    updateCurrentUser: (state, action) => {
      state.user = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});
export const {
  setAuthUser,
  updateCurrentUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  setUserProfiles,
} = authSlice.actions;
export default authSlice.reducer;
