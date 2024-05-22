import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    user: {

    },
    token: "",
    userProfil: {
        user: {
            
        },
        questions: {

        },
        clues: {

        },
        categories: [

        ],
        subCategories: [
            
        ]
    }
};


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loadToken: (state, action) => {
            state.token = action.payload;
        },
        loadUserMe: (state, action) => {
            state.user = action.payload;
        },
        deleteUserMe: (state, action) => {
            state.user = {};
            state.token = "";
        },
        changeNotification: (state, action) => {
            const notificationIndex = state.user.notifications.findIndex(notification => notification.id === action.payload);
            state.user.notifications[notificationIndex].seen = true;
        },
        loadUserProfil: (state, action) => {
            state.userProfil.user = action.payload;
        },
        loadQuestionsUserProfil: (state, action) => {
            state.userProfil.questions = action.payload;
        },
        loadCluesUserProfil: (state, action) => {
            state.userProfil.clues = action.payload;
        },
        loadCategories: (state, action) => {
            state.userProfil.categories.push(action.payload)
        },
        removeCategories: (state, action) => {
            state.userProfil.categories = state.userProfil.categories.filter( category => category.id !== action.payload);
        },
        loadSubCategories: (state, action) => {
            state.userProfil.subCategories = action.payload;
        },
    }
});

export default userSlice.reducer;

export const { loadToken, loadUserMe, changeNotification, loadUserProfil, deleteUserMe, loadQuestionsUserProfil, loadCluesUserProfil, loadCategories, removeCategories, loadSubCategories } = userSlice.actions;