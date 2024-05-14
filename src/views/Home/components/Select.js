import { activeElm } from '../../../ui/UIutils';
import { useContext } from "react";
import { UIContext } from '../../../Components/UIProvider';

export default function Select() {
    const { changeFilterQuestion, clueMode, changeFilterClue} = useContext(UIContext);

    return (
        <div>
            <ul className={`d-flex align-items-center ${clueMode ? "cluesList" : "elmsList"}  mb-1`}>
                <li className="ms-lg-4 ms-1 active" onClick={(event) => {
                        activeElm(event, clueMode ? "cluesList" : "elmsList");
                        clueMode ? changeFilterClue(['?page=1', '']) : changeFilterQuestion(['?page=1', '']);
                    }}>
                    Toutes
                </li>
                <li className="ms-lg-4 ms-1" onClick={(event) => {
                        activeElm(event, clueMode ? "cluesList" : "elmsList");
                        clueMode ? changeFilterClue(['&page=1','?order[popularity]=desc']) : changeFilterQuestion(['&page=1','?order[popularity]=desc']);
                    }}>
                    Populaires
                </li>
                <li className="ms-lg-4 ms-1" onClick={(event) => {
                        activeElm(event, clueMode ? "cluesList" : "elmsList");
                        clueMode ? changeFilterClue(['&page=1', '?order[createdAt]=desc']) : changeFilterQuestion(['&page=1', '?order[createdAt]=desc']);
                    }}>
                    Récentes
                </li>
            </ul>
        </div>
    )

}