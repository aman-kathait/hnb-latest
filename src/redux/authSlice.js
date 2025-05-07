import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    userProfiles:[],
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
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
export const { setAuthUser,updateCurrentUser,setSuggestedUsers,setUserProfile,setSelectedUser,setUserProfiles} = authSlice.actions;
export default authSlice.reducer;
