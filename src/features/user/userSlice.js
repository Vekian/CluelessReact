import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    user: {

    },
    JWBToken: {
        token: "",
        isValid: false,
    },
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
            state.JWBToken.token = action.payload;
        },
        isTokenValid: (state, action) => {
            state.JWBToken.isValid = action.payload;
        },
        loadUserMe: (state, action) => {
            state.user = action.payload;
        },
        deleteUserMe: (state, action) => {
            state.user = {};
            state.JWBToken.token = "";
            state.JWBToken.isValid = false;
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

export const { loadToken, isTokenValid, loadUserMe, loadUserProfil, deleteUserMe, loadQuestionsUserProfil } = userSlice.actions;