import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    questions: [

    ],
    question: {

    },
    originAnswer: {
        question: {
            answer: "",
            comment: ""
        },
        answer: "",
    }
};


export const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        loadQuestions: (state, action) => {
            state.questions.push(action.payload);
        },
        emptyQuestions: (state, action) => {
            state.questions=[];
        },
        loadQuestion: (state, action) => {
            state.question = action.payload;
        },
        loadOriginAnswer: (state, action) => {
            if (action.payload.type === "questionAnswer"){
                state.originAnswer.question.answer = action.payload.origin;
            }
            else if (action.payload.type === "questionComment"){
                state.originAnswer.question.comment = action.payload.origin;
            }
            else if (action.payload.type === "answer"){
                state.originAnswer.answer = action.payload.origin;
            }
        },
        emptyOrigin: (state, action) => {
            state.originAnswer.question.answer = "";
            state.originAnswer.question.comment = "";
            state.originAnswer.answer = "";
            state.originAnswer.comment = "";
        },
    }
});

export default questionSlice.reducer;

export const { loadQuestions, loadQuestion, loadOriginAnswer, emptyOrigin, emptyQuestions } = questionSlice.actions;