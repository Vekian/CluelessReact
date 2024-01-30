import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    categories: [

    ]
};


export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        loadCategory: (state, action) => {
            state.categories.push(action.payload);
        },
    }
});

export default categorySlice.reducer;

export const { loadCategory } = categorySlice.actions;