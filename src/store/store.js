import { configureStore } from "@reduxjs/toolkit"
import editorReducer from "../features/editor/editorSlice";
import userReducer from "../features/user/userSlice";
import { questionApi } from "../features/api/questionSlice";
import { clueApi } from "../features/api/clueSlice";
import { categoryApi } from "../features/api/categorySlice";
import { answerApi } from "../features/api/answerSlice";
import { commentApi } from "../features/api/commentSlice";
import { voteApi } from "../features/api/voteSlice";

export const store = configureStore({
    reducer: {
        editor: editorReducer,
        user: userReducer,
        [questionApi.reducerPath]: questionApi.reducer,
        [clueApi.reducerPath]: clueApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [answerApi.reducerPath]: answerApi.reducer,
        [commentApi.reducerPath]: commentApi.reducer,
        [voteApi.reducerPath]: voteApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(questionApi.middleware).concat(clueApi.middleware).concat(categoryApi.middleware).concat(answerApi.middleware).concat(commentApi.middleware).concat(voteApi.middleware),
    
})