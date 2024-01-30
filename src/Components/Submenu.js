import { Link, useLocation } from 'react-router-dom';
import { fetchData } from '../api/APIutils';
import { loadQuestions, emptyQuestions} from '../features/question/questionSlice';
import { useDispatch } from 'react-redux';

function SubMenu() {
    const location = useLocation();
    const dispatch = useDispatch();


    function displayMenu(event) {
        const clickedElement = event.currentTarget;
        let buttonMenu = clickedElement.querySelector('.arrowMenu');

        buttonMenu.classList.toggle("rotateDown");

        let menu = document.querySelector('.subMenuHeaderContainer');
        let main = document.querySelector('.mainContent');
        menu.classList.toggle("moveUp");
        main.classList.toggle("changeMarge");
    }

    function loadData(data){
        dispatch(emptyQuestions());
        for (let question of data["hydra:member"]){
            dispatch(loadQuestions(question));
        } 
    }

    return(
        <div className=" w-100 overflow-hidden">
            <div className="d-flex flex-column align-items-center subMenuHeaderContainer w-100">
                <div className="subMenuHeader d-flex justify-content-around align-items-center">
                    <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={(event) => {
                            fetchData('questions?page=1', 'GET', loadData);
                        }}>
                        <i className="fa-solid fa-house "></i>
                    </Link>
                    <a >
                        <i className="fa-solid fa-question"></i>
                    </a>
                    <a >
                        <i className="fa-solid fa-lightbulb"></i>
                    </a>
                    <a >
                        <i className="fa-solid fa-users"></i>
                    </a>
                    <a >
                        <i className="fa-solid fa-trophy"></i>
                    </a>
                </div>
                <span className="containerButtonSubMenuHeader">
                    <div className="buttonSubMenuHeader text-center" onClick={(event) => displayMenu(event)}>
                        <i className="fa-solid fa-angle-up arrowMenu"></i>
                    </div>
                </span>
            </div>
            
        </div>
    )
}

export default SubMenu;