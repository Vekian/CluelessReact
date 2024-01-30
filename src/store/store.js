import { configureStore } from "@reduxjs/toolkit"
import categoryReducer from "../features/category/categorySlice";
import questionReducer from "../features/question/questionSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
    reducer: {
        category: categoryReducer, 
        question: questionReducer,
        user: userReducer
    },
})