import { categoryApi } from "../../features/api/categorySlice";
import {  useDispatch, useSelector } from 'react-redux';
import { loadSubCategories, loadCategoriesToSend, removeCategoriesToSend} from '../../features/editor/editorSlice';


function AddCategories() {
    const writeQuestion = useSelector(state => state.editor.writeQuestion);
    const categories = categoryApi.endpoints.getCategories.useQueryState();
    const dispatch = useDispatch();

    function displayCategories(event) {
        const idCategory = event.currentTarget.value;
        for (let category of categories.data['hydra:member']) {
            if (category.id == idCategory) {
                dispatch(loadSubCategories(category.categories));
                return;
            }
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
                <ul className="d-flex flex-wrap align-items-center mb-0">
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
    )
}
export default AddCategories;