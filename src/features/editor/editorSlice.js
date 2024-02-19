import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    writeQuestion: {
        title: "",
        subCategories: [],
        categoriesToSend: [],
        content: "",
    }
};


export const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        loadSubCategories: (state, action) => {
            state.writeQuestion.subCategories = action.payload;
        },
        loadCategoriesToSend: (state, action) => {
            state.writeQuestion.categoriesToSend.push(action.payload) ;
        },
        removeCategoriesToSend: (state, action) => {
            state.writeQuestion.categoriesToSend = state.writeQuestion.categoriesToSend.filter( category => category.id !== action.payload);
        },
        loadContentToSend: (state, action) => {
            state.writeQuestion.content= action.payload;
        },
        loadTitleToSend: (state, action) => {
            state.writeQuestion.title= action.payload;
        }, 
        removeQuestionToSend: (state, action) => {
            state.writeQuestion.categoriesToSend = [];
            state.writeQuestion.subCategories = [];
            state.writeQuestion.content = "";
            state.writeQuestion.title = "";
        }
    }
});

export default editorSlice.reducer;

export const { loadSubCategories, loadCategoriesToSend, removeCategoriesToSend, loadTitleToSend, loadContentToSend, removeQuestionToSend } = editorSlice.actions;