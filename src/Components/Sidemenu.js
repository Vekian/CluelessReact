import { fetchData, displayElement} from '../api/APIutils';
import { loadQuestions, emptyQuestions} from '../features/question/questionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

function Sidemenu() {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.category.categories);

    function loadData(data){
        dispatch(emptyQuestions());
        for (let question of data["hydra:member"]){
            dispatch(loadQuestions(question));
        } 
    }

    function searchQuestions(event){
        event.stopPropagation();
        const idCategory = event.currentTarget.dataset.categoryId;
        let params = "questions?page=1&tags.category.id=" + idCategory;
        
        fetchData(params, 'GET', loadData);
    }

    return(
        <div className="sideMenu pt-4 ps-4 col-lg-2 col-3 d-flex flex-column align-items-start d-sm-block d-none">
            <div className="d-flex  align-items-center mb-2 pt-1 pb-1 ps-1 itemMenu col-11 ms-1">
                <i className="fa-solid fa-question col-1 me-2" style={{ color: "#000000" }}></i> 
                <h5>
                    Populaires
                </h5>
            </div>
            <span className="separator d-block"></span>
            <ul className="col-11 listCategories">
                <div className="d-flex align-items-center itemMenu mt-3 mb-2" onClick={(event) => displayElement(event, "sideMenu", "listCategories")}>
                    <h4 className="d-flex  justify-content-between col-10" >
                        Catégories
                    </h4> 
                    <div className="col-2 d-flex justify-content-center">
                        <i className="fa-solid fa-angle-up"></i>
                    </div>
                </div>
                {categories.map(category => 
                    category.categories.length > 0 ? 
                        <li key={category.id + category.name} className='active categoryContainer'>
                            <ul  className="listCategories" >
                                <div className="d-flex align-items-center">
                                    <Link to="/"  className="d-flex col-10 align-items-center ps-1 pt-1 pb-1 itemMenu" data-category-id={category.id} onClick={(event) => searchQuestions(event)} style={{ color: 'inherit', textDecoration: 'inherit'}}>
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
                                                <h6 className="col-10">{subCategory.name}</h6>
                                            </Link>
                                        </li>
                                    )}
                            </ul>
                        </li> 
                        : 
                        null
                    )}
            </ul>
            <span className="separator"></span>
            <div className='toolsContainer'>
                <ul className="col-11 listTools">
                    <div className="d-flex align-items-center itemMenu mt-3 mb-2" onClick={(event) => displayElement(event, "toolsContainer", "listTools")}>
                        <h4 className="d-flex  justify-content-between col-10" >
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
                            <h5>Devenir premium</h5>
                        </div>
                    </li>
                </ul>
            </div>
            
        </div>
    );
}

export default Sidemenu;