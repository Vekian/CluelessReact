import "./Editor.css"
import TextArea from "../../Components/TextArea";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAddQuestionMutation } from "../../features/api/questionSlice";
import { useAddClueMutation } from "../../features/api/clueSlice";
import { useNavigate } from 'react-router-dom';
import { categoryApi } from "../../features/api/categorySlice";
import { loadSubCategories, loadCategoriesToSend, removeCategoriesToSend, loadContentToSend, loadTitleToSend, removeQuestionToSend } from '../../features/editor/editorSlice';

function Editor(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [contentToSend, setContentToSend] = useState();
    const categories = categoryApi.endpoints.getCategories.useQueryState();
    const writeQuestion = useSelector(state => state.editor.writeQuestion);
    const user = useSelector(state => state.user);
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

    function displayCategories(event) {
        const idCategory = event.currentTarget.value;
        for (let category of categories.data['hydra:member']) {
            if (category.id == idCategory) {
                dispatch(loadSubCategories(category.categories));
                return;
            }
        }
    }

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
        const title = document.getElementById('title').value;
        const categoriesData = writeQuestion.categoriesToSend;
        const content = writeQuestion.content;
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
            user: `/api/users/${user.user.user_id}`,
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

    function addCategory() {
        if (writeQuestion.categoriesToSend.length >= 4) {
            return
        }
        let categoryId = document.getElementById('category').value;
        let compareCategories = writeQuestion.categoriesToSend;
        if (categoryId) {
            let subCategoryId = document.getElementById('subCategory').value;
            for (let category of categories.data['hydra:member']) {
                if (category.id == categoryId || category.id == subCategoryId) {
                    if(compareCategories.length === 0) {
                            dispatch(loadCategoriesToSend(category));
                    }
                    else if (!compareCategories.includes(category)){
                            dispatch(loadCategoriesToSend(category));
                    }
            }}
        }
        
    }

    function removeCategory(event){
        const id = parseInt(event.currentTarget.dataset.id);
        dispatch(removeCategoriesToSend(id));
    }

    return (
        <div>
            <div className="d-flex flex-column ">
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
                <div className="d-flex flex-column writeQuestionItem mb-4">
                    <h3>
                        Sélectionnez une catégorie
                    </h3>
                    <label htmlFor="category" className="mb-3">
                        Sélectionnez une catégorie ou sous-catégorie pour augmenter vos chances de réponses (maximum 5)
                    </label>
                    <div className="d-flex ms-2">
                        <select id="category" name="tags" className="me-5" onChange={event => displayCategories(event)}>
                            <option value="" hidden>
                                Catégories
                            </option>
                            { categories.isSuccess ?
                                categories.data['hydra:member'].map(category =>
                                    category.categories.length > 0 ? 
                                        <option value= {category.id} key={category.id + "writeQuestion"}>
                                            {category.name}
                                        </option> 
                                        : null
                                )
                                : null
                            }
                        </select>
                        {
                            writeQuestion.subCategories.length > 0 ? 
                            <select id="subCategory" name="subTags" className="me-5">
                                <option value=""hidden>
                                    Sous-categorie
                                </option>
                                <option value="" >
                                    Aucune
                                </option>
                                { writeQuestion.subCategories.map(subCategory => 
                                        <option value={subCategory.id} key={subCategory.id + "writeQuestion"}>
                                            {subCategory.name}
                                        </option>
                                    )}
                            </select> : null
                        }
                        <button className="buttonStyle" id="addCategory" onClick={event => addCategory()}>
                            Ajouter
                        </button>
                        <ul className="d-flex align-items-center mb-0">
                            { writeQuestion.categoriesToSend.map(categoryToSend => 
                            <div className="d-flex align-items-center">
                                <li key={categoryToSend.id + "categoryToSend"} className="ms-2 mt-1">
                                    {categoryToSend.name}
                                </li >
                                <i className="fa-solid fa-trash-can ms-2 pt-1" style={{color: "#e01b24",}} data-id={categoryToSend.id} onClick={event => removeCategory(event)} ></i>
                            </div>
                            )}
                        </ul>
                    </div>
                </div>
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
                <div className="text-center pt-3">
                    <button className="buttonStyle" onClick={event => sendQuestion()}>
                        Soumettre
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Editor;