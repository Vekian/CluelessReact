import { fetchData} from '../api/APIutils';
import { loadQuestions, emptyQuestions} from '../features/question/questionSlice';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import ProfilHeader from './ProfilHeader';


function Header () {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.category.categories);
    const user = useSelector(state => state.user);

    function displaySideMenu(event){
        const sideMenu = document.querySelector('.sideMenu');
        if (sideMenu.classList.contains('d-none')) {
            sideMenu.classList.remove('d-none');
        } else {
            sideMenu.classList.add('d-none');
        }
    }


    function loadData(data){
        dispatch(emptyQuestions());
        for (let question of data["hydra:member"]){
            dispatch(loadQuestions(question));
        } 
    }

    function searchQuestions(event){
        const idCategory = document.getElementById('categories').value;
        const inputSearch = document.getElementById('searchInput').value;
        let params = "questions?page=1&tags.category.id=" + idCategory + "&content=" + inputSearch;
 
        fetchData(params, 'GET', loadData);
    }

    return (
        <header>
            <div className="headerMain w-100 d-flex align-items-center justify-content-around" >
                <button className="burgerSideMenu" onClick={event => displaySideMenu(event)}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="d-flex flex-column justify-content-center h-100 ms-lg-1 ms-sm-4">
                    <img src={ process.env.REACT_APP_URL + "assets/images/logo.png"} alt="logo" className="logo"/>
                    <h1 className="logoTitle">
                        Clueless
                    </h1>
                </div>
                
                <div className=" pt-2 pb-2 d-flex searchElm">
                    <form action="" className="d-flex align-items-center">
                        <select className="searchButtonHeader justify-content-center" id="categories" name="categories" >
                            <option value=""  hidden>Catégories</option>
                            {categories.map(category =>
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
                                )}
                        </select>
                        < input type="text" className="searchInputHeader ps-2" placeholder="Rechercher une question" id="searchInput" name="content">
                        </input>
                        <button type="submit" className="searchSubmitHeader pe-3" onClick={(event) => searchQuestions(event)}>
                            <i className="fa-solid fa-magnifying-glass" style={{ color: "#000000" }}></i>
                        </button>
                    </form>
                </div>
                <div>
                    {user.JWBToken.isValid ? 
                        < ProfilHeader  user={user.user} />
                         : 
                         <button className="Btn" data-bs-toggle="modal" data-bs-target="#loginModal">
                            Se connecter
                        </button>
                    }
                </div>
            </div>
        </header>
    );
};

export default Header;