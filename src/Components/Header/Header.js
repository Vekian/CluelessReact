import './Header.css';
import { useSelector } from 'react-redux';
import ProfilHeader from './ProfilHeader';
import React, { useEffect, useContext } from 'react';
import { UIContext } from '../UIProvider';
import { categoryApi } from '../../features/api/categorySlice';
import { displaySideMenu } from '../../ui/UIutils';
import Notifications from './Notifications';
import DarkModeButton from './DarkModeButton';
import { useNavigate } from 'react-router-dom';

export default function Header () {
    const navigate = useNavigate();
    const categories = categoryApi.endpoints.getCategories.useQueryState();
    const user = useSelector(state => state.user);
    const {toggleDarkMode, clueMode, changeFilterQuestion, changeFilterClue} = useContext(UIContext);

    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode){
            toggleDarkMode();
        }
      }, []);

    function searchQuestions(event){
        event.preventDefault();
        const idCategory = document.getElementById('categories').value;
        const inputSearch = document.getElementById('searchInput').value;
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
        <header>
            <div className="headerMain w-100 d-flex align-items-center justify-content-around" >
                <button className="burgerSideMenu" onClick={event => displaySideMenu(event)}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className='d-flex h-100'>
                    <div className="d-flex flex-column align-items-center justify-content-center ms-lg-1 ms-sm-4">
                        <img src={ process.env.REACT_APP_URL_IMG + "logo.png"} alt="logo" className="logo"/>
                        <h1 className="logoTitle">
                            Clueless
                        </h1>
                    </div>
                    <div className='ms-lg-5 d-flex align-items-center darkModeToggle'>
                        < DarkModeButton />
                    </div>
                </div>
                
                <div className="pt-xxl-2 pt-1 pb-1 pb-xxl-2 d-flex searchElm">
                    <form action="" className="d-flex align-items-center">
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
                        <button type="submit" className="searchSubmitHeader pe-3" onClick={(event) => searchQuestions(event)}>
                            <i className="fa-solid fa-magnifying-glass" style={{ color: "#000000" }}></i>
                        </button>
                    </form>
                </div>
                <div className='d-flex align-items-center'>
                    < Notifications user={user} />
                    {user.token ? 
                        < ProfilHeader  user={user.user} />
                         : 
                         <button className="buttonLogin" data-bs-toggle="modal" data-bs-target="#loginModal">
                            Se connecter
                        </button>
                    }
                </div>
            </div>
        </header>
    );
};