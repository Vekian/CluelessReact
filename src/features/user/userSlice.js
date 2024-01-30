import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    userMe: {

    },
    JWBToken: {
        token: "",
        isValid: false,
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
        }
    }
});

export default userSlice.reducer;

export const { loadToken, isTokenValid, loadUserMe } = userSlice.actions;