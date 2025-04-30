import { createSlice } from "@reduxjs/toolkit";
const announcementSlice = createSlice({
    name:'announcement',
    initialState:{
        announcements:[],
        selectedAnnouncement:null,
    },
    reducers:{
        //actions
        setAnnouncements:(state,action) => {
            state.announcements = action.payload;
        },
        setSelectedAnnouncement:(state,action) => {
            state.selectedAnnouncement = action.payload;
        }
    }
});
export const {setAnnouncements,setSelectedAnnouncement} = announcementSlice.actions;
export default announcementSlice.reducer;