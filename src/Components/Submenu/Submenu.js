import './Submenu.css';
import { Link, useLocation } from 'react-router-dom';

function SubMenu() {
    const location = useLocation();

    function displayMenu(event) {
        const clickedElement = event.currentTarget;
        let buttonMenu = clickedElement.querySelector('.arrowMenu');

        buttonMenu.classList.toggle("rotateDown");

        let menu = document.querySelector('.subMenuHeaderContainer');
        let main = document.querySelector('.mainContent');
        menu.classList.toggle("moveUp");
        main.classList.toggle("changeMarge");
    }


    return(
        <div className=" w-100 overflow-hidden subMenuMain">
            <div className="d-flex flex-column align-items-center subMenuHeaderContainer w-100">
                <div className="subMenuHeader d-flex justify-content-around align-items-center">
                    <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                        <i className="fa-solid fa-house "></i>
                    </Link>
                    <Link to="/create/question" className={location.pathname === "/create/question" ? "active" : ""}>
                        <i className="fa-solid fa-question"></i>
                    </Link>
                    <Link to="/create/clue" className={location.pathname === "/create/clue" ? "active" : ""}>
                        <i className="fa-solid fa-lightbulb"></i>
                    </Link>
                    <Link to="/helpers" className={location.pathname === "/helpers" ? "active" : ""}>
                        <i className="fa-solid fa-users"></i>
                    </Link>
                    <Link to="/rankings" className={location.pathname === "/rankings" ? "active" : ""}>
                    <i className="fa-solid fa-trophy"></i>
                    </Link>
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