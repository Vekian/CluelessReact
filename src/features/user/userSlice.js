import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    user: {

    },
    token: "",
    userProfil: {
        user: {

        },
        questions: {

        }
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
        loadUserProfil: (state, action) => {
            state.userProfil.user = action.payload;
        },
        loadQuestionsUserProfil: (state, action) => {
            state.userProfil.questions = action.payload;
        },
    }
});

export default userSlice.reducer;

export const { loadToken, loadUserMe, loadUserProfil, deleteUserMe, loadQuestionsUserProfil } = userSlice.actions;