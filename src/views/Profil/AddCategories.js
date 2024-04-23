import { categoryApi } from "../../features/api/categorySlice";
import {  useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadSubCategories, loadCategories, removeCategories} from '../../features/user/userSlice';


function AddCategories() {
    const userProfil = useSelector(state => state.user.userProfil);
    const categories = categoryApi.endpoints.getCategories.useQueryState();
    const dispatch = useDispatch();

    

    useEffect(() => {
        if(userProfil.categories.length === 0 && userProfil.user?.tags.length > 0) {
            for (let tag of userProfil.user.tags) {
                for(let category of categories.data['hydra:member']) {
                    if (category.id == tag.category.id) {
                        dispatch(loadCategories(category));
                        break;
                    }
                }
            }
        }
    }, [])

    function displayCategories(event) {
        const idCategory = event.currentTarget.value;
        for (let category of categories.data['hydra:member']) {
            if (category.id == idCategory) {
                dispatch(loadSubCategories(category.categories));
                return;
            }
        }
    }

    function addCategory(event) {
        event.preventDefault();
        if (userProfil.categories.length >= 4) {
            return
        }
        let categoryId = document.getElementById('category').value;
        let compareCategories = userProfil.categories;
        if (categoryId) {
            let subCategoryId = document.getElementById('subCategory').value;
            for (let category of categories.data['hydra:member']) {
                if (category.id == categoryId || category.id == subCategoryId) {
                    if(compareCategories.length === 0) {
                            dispatch(loadCategories(category));
                    }
                    else if (!compareCategories.includes(category)){
                            dispatch(loadCategories(category));
                    }
            }}
        }
        
    }

    function removeCategory(event){
        const id = parseInt(event.currentTarget.dataset.id);
        dispatch(removeCategories(id));
    }

    return (
        <div className="d-flex flex-column userProfilItem mb-4">
            <label htmlFor="category" className="mb-3 fw-bold mt-3">
                Sélectionnez une catégorie ou sous-catégorie préférée (maximum 5)
            </label>
            <div className="d-flex ms-2">
                <select id="category" name="tags" className="me-5" onChange={event => displayCategories(event)}>
                    <option value="" hidden>
                        Catégories
                    </option>
                    { categories.isSuccess ?
                        categories.data['hydra:member'].map(category =>
                            category.categories.length > 0 ? 
                                <option value= {category.id} key={category.id + "userProfil"}>
                                    {category.name}
                                </option> 
                                : null
                        )
                        : null
                    }
                </select>
                {
                    userProfil.subCategories.length > 0 ? 
                    <select id="subCategory" name="subTags" className="me-5">
                        <option value=""hidden>
                            Sous-categorie
                        </option>
                        <option value="" >
                            Aucune
                        </option>
                        { userProfil.subCategories.map(subCategory => 
                                <option value={subCategory.id} key={subCategory.id + "userProfil"}>
                                    {subCategory.name}
                                </option>
                            )}
                    </select> : null
                }
                <button className="buttonStyle" id="addCategory" onClick={event => addCategory(event)}>
                    Ajouter
                </button>
                <ul className="d-flex align-items-center mb-0">
                { userProfil.categories[0] && userProfil.categories.map(category => 
                    <div className="d-flex align-items-center">
                        <li key={category.id + "category"} className="ms-2 mt-1">
                            {category.name}
                        </li >
                        <i className="fa-solid fa-trash-can ms-2 pt-1" style={{color: "#e01b24",}} data-id={category.id} onClick={event => removeCategory(event)} ></i>
                    </div>
                    )}
                </ul>
            </div>
        </div>
    )
}
export default AddCategories;