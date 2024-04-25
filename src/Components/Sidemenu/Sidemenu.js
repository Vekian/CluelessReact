import './Sidemenu.css';
import React, { useContext } from 'react';
import { useGetCategoriesQuery } from '../../features/api/categorySlice';
import { UIContext } from '../UIProvider';
import { loadingElm, displayElement } from '../../ui/UIutils';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Sidemenu() {
    const {data, error, isFetching} = useGetCategoriesQuery();
    const {changeFilterQuestion} = useContext(UIContext);
    const location = useLocation();
    const user = useSelector(state => state.user.user);

    function searchQuestions(event){
        event.stopPropagation();
        const idCategory = event.currentTarget.dataset.categoryId;
        let filter = "?tags.category.id=" + idCategory;
        let page = "&page=1";
        changeFilterQuestion([page, filter]);
    }

    return(
        <div className="sideMenu pt-4 ps-sm-3 ps-xl-5 ps-1 col-sm-3 col-lg-2 col-6 d-flex flex-column align-items-start d-sm-block d-none">
            <div className="d-flex text-center align-items-center mb-2 pt-1 pb-1 ps-2 itemMenu col-11 ms-1">
                <i className="fa-solid fa-question col-1 me-2" style={{ color: "#000000" }}></i> 
                <h5>
                    Populaires
                </h5>
            </div>
            <div className="d-flex text-center align-items-center mb-2 pt-1 pb-1 ps-2 itemMenu col-11 ms-1">
                <i className="fa-solid fa-exclamation col-1 me-2" style={{ color: "#000000" }}></i> 
                <h5>
                    Populaires
                </h5>
            </div>
            <span className="separator d-block"></span>
            <ul className="col-11 listCategories">
                <div className="d-flex align-items-center itemMenu mt-3 mb-2" onClick={(event) => displayElement(event, "sideMenu", "listCategories")}>
                    <h4 className="d-flex  justify-content-between col-10 ps-2" >
                        Catégories
                    </h4> 
                    <div className="col-2 d-flex justify-content-center">
                        <i className="fa-solid fa-angle-up"></i>
                    </div>
                </div>
                { isFetching ?
                loadingElm() 
                :
                error ?
                <div>
                    Erreur de chargement
                </div>
                :
                data['hydra:member'].map(category => 
                    category.categories.length > 0 ? 
                        <li key={category.id + category.name} className='active categoryContainer'>
                            <ul  className="listCategories" >
                                <div className="d-flex align-items-center">
                                    <Link to="/"  className="d-flex col-10 align-items-center ps-2 pt-1 pb-1 itemMenu" data-category-id={category.id} onClick={(event) => searchQuestions(event)} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                        <i className={category.icon + " me-xxl-3 pe-1 col-3 col-xxl-2 "}></i> 
                                        <h5 className="col-9 col-xxl-10">
                                            {category.name}
                                        </h5>
                                    </Link>
                                    <div className="itemMenu pt-2 pb-2 col-2 d-flex justify-content-center" onClick={(event) => displayElement(event, "categoryContainer", "listCategories")}>
                                        <i className="fa-solid fa-angle-up rotateDown "></i>
                                    </div>
                                </div>
                                {category.categories.map(subCategory =>
                                        <li key={subCategory.id + subCategory.name}  data-category-id={subCategory.id} onClick={(event) => searchQuestions(event)} className="d-flex itemMenu offset-1">
                                            <Link to="/" className="d-flex align-items-center pt-1 pb-1 col-12" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                                <i className={subCategory.icon + " col-2"}></i> 
                                                <h6 className="col-10 ps-2">{subCategory.name}</h6>
                                            </Link>
                                        </li>
                                    )}
                            </ul>
                        </li> 
                        : 
                        null
                    )}
            </ul>
            <span className="separator d-block"></span>
            <div className='toolsContainer'>
                <ul className="col-11 listTools">
                    <div className="d-flex align-items-center itemMenu mt-3 mb-2" onClick={(event) => displayElement(event, "toolsContainer", "listTools")}>
                        <h4 className="d-flex  justify-content-between col-10 ps-2" >
                            Outils
                        </h4> 
                        <div className="col-2 d-flex justify-content-center">
                            <i className="fa-solid fa-angle-up"></i>
                        </div>
                    </div>
                    <li className='active itemMenu ps-1'>
                        <div className="d-flex align-items-center pt-1 pb-1">
                            <i className="fa-regular fa-circle-question me-3"></i>
                            <h5>Aide</h5>
                        </div>
                    </li>
                    <li className='active itemMenu ps-1'>
                        <div className="d-flex align-items-center pt-1 pb-1">
                            <i className="fa-solid fa-crown me-xxl-3"></i>
                            <h5 className='ps-2 ps-xxl-0'>Devenir premium</h5>
                        </div>
                    </li>
                    {
                        user?.id &&
                        <li className='active itemMenu ps-1'>
                            <Link to="/settings" className={location.pathname === "/settings" ? "item-active d-flex align-items-center pt-1 pb-1" : "d-flex align-items-center pt-1 pb-1"}  style={{ color: 'inherit', textDecoration: 'inherit'}} >
                                <i className="fa-solid fa-wrench me-xxl-3"></i>
                                <h5 className='ps-2 ps-xxl-0'>Paramètres de compte</h5>
                            </Link>
                        </li>
                    }
                </ul>
            </div>
            
        </div>
    );
}

export default Sidemenu;