import "./Editor.css"
import TextArea from "./TextArea";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAddQuestionMutation } from "../../features/api/questionSlice";
import { useAddClueMutation } from "../../features/api/clueSlice";
import { useNavigate } from 'react-router-dom';
import { loadContentToSend, loadTitleToSend, removeQuestionToSend } from '../../features/editor/editorSlice';
import AddCategories from "./AddCategories";

export default function Editor(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [contentToSend, setContentToSend] = useState();
    const writeQuestion = useSelector(state => state.editor.writeQuestion);
    const user = useSelector(state => state.user);
    const [errorState, setErrorState] = useState("");
    const [addQuestion, {data: dataQuestion, isSuccess: successQuestion} ] = useAddQuestionMutation();
    const [addClue, {data: dataClue, isSuccess: successClue} ] = useAddClueMutation();

    useEffect(() => {
        if (successQuestion || successClue) {
            if (successClue) {
                refreshQuestion(dataClue, "clue");
                dispatch(removeQuestionToSend());
            }
            else if (successQuestion) {
                refreshQuestion(dataQuestion, "question");
                dispatch(removeQuestionToSend());
            }
        }
    }, [successClue, successQuestion]);

    useEffect(() => {
        dispatch(loadContentToSend(contentToSend));
    }, [contentToSend])

    function refreshQuestion(data, type){
        let adresse = "";
        if (type === "question") {
            adresse = "/question/" + data.id;
        }
        else {
            adresse = "/clue/" + data.id;
        }
        navigate(adresse);
    }

    function sendQuestion(){
        setErrorState("");
        const title = document.getElementById('title').value;
        if (!title) {
            setErrorState("Un titre est requis");
            return;
        }
        const categoriesData = writeQuestion.categoriesToSend;
        const content = writeQuestion.content;
        if (!content) {
            setErrorState("Une description est requise");
            return;
        }
        let tags = [];

        for (let categoryData of categoriesData) {
            let tag = {
                category: `/api/categories/${categoryData.id}`
            }
            tags.push(tag);
        }
        const body = {
            title : title,
            content : content,
            user: `/api/users/${user.user.id}`,
            tags: tags
        }
        const token = user.token;
        const bodyJson = JSON.stringify(body);
        if (props.type === "question") {
            addQuestion({ body: bodyJson, token: token});
        }
        else if (props.type === "clue") {
            addClue({ body: bodyJson, token: token});
        }
        
    }

    return (
        <div className="ps-xxl-0 pe-xxl-0 ps-3 pe-3">
            <div className="d-flex flex-column pb-3">
                {props.type === 'question' ?
                    <h1 className="mb-4">
                        Poser une question publique
                    </h1>
                    :
                    <h1 className="mb-4">
                        Proposer une astuce
                    </h1>
                }
                
                <div className="d-flex flex-column writeQuestionItem mb-4">
                    <h3>
                        Titre
                    </h3>
                    {props.type === "question" ? 
                        <label htmlFor="title" className="mb-3">
                            Soyez précis et faites comme si vous posez une question à une autre personne
                        </label>
                        :
                        <label htmlFor="title" className="mb-3">
                            Résumez de manière concise votre astuce.
                        </label>
                    }
                    
                    <input type="text" value={writeQuestion.title} name="title" id="title" onChange={(event) => dispatch(loadTitleToSend(event.currentTarget.value))}/>
                </div>
                <>
                    < AddCategories />
                </>
                <div className=" writeQuestionItem">
                    {props.type === "question" ? 
                        <>
                            <h3>
                                Décrivez votre problème
                            </h3>
                            <label className="mb-3">
                                Développez ce que vous avez écrit dans le titre et décrivez ce que vous avez essayé et espéré obtenir
                            </label>  
                        </>
                        :
                        <>
                            <h3>
                                Contenu de votre astuce
                            </h3>
                            <label className="mb-3">
                                Développez ce que vous avez écrit dans le titre et décrivez votre astuce
                            </label>  
                        </>
                    }
                    <div>
                        <TextArea setContent={setContentToSend} content={writeQuestion.content}/>
                    </div>
                </div>
                <div className="text-center fw-bold mt-2">
                    {
                        errorState !== "" &&
                        <span className="text-danger">
                            { errorState }
                        </span>
                    }
                </div>
                <div className="text-center pt-3">
                    <button className="buttonStyle" onClick={event => sendQuestion()}>
                        Soumettre
                    </button>
                </div>
            </div>
        </div>
    )
}