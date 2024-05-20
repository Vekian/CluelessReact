import { categoryApi } from '../../features/api/categorySlice';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { UIContext } from '../UIProvider';

export default function Search(){
    const navigate = useNavigate();
    const categories = categoryApi.endpoints.getCategories.useQueryState();
    const {clueMode, changeFilterQuestion, changeFilterClue} = useContext(UIContext);

    function searchQuestions(event){
        event.preventDefault();
        const idCategory = event.target.elements['categories'].value;
        const inputSearch = event.target.elements['content'].value;
        let filter = "";
        if (idCategory && !inputSearch){
            filter = "?tags.category.id=" + idCategory;
        }
        else {
            filter = "?search=" + inputSearch + "&tags.category.id=" + idCategory;
        }
        let page = "&page=1";
        clueMode ? changeFilterClue([page, filter]) : changeFilterQuestion([page, filter]);
        navigate('/');
    }

    return (
        <form action="" className="d-flex align-items-center" onSubmit={(event) => searchQuestions(event)}>
            <select className="searchButtonHeader justify-content-center ps-2" id="categories" name="categories" >
                <option value=""  hidden>Catégories</option>
                {
                categories.data ?
                    categories.data['hydra:member'].map(category =>
                            category.categories.length > 0 ?
                            <React.Fragment key={category.id + category.name}>
                                <option value={category.id} key={category.id + category.name}>
                                    {category.name}
                                </option>
                                {category.categories.map(subCategory => 
                                    <option value={subCategory.id} key={subCategory.id + subCategory.name}>
                                    |_ {subCategory.name}
                                    </option>
                                    )}
                            </React.Fragment>
                            : null
                        )
                    : null
                }
            </select>
            < input type="text" className="searchInputHeader ps-2" placeholder="Rechercher une question" id="searchInput" name="content">
            </input>
            <button type="submit" className="searchSubmitHeader pe-3">
                <i className="fa-solid fa-magnifying-glass" style={{ color: "#000000" }}></i>
            </button>
        </form>
    )
}