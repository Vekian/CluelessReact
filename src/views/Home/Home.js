import Questions from "./components/Questions";
import './Home.css';
import Clues from "./components/Clues";
import { useContext } from "react";
import { UIContext } from "../../Components/UIProvider";
import Select from "./components/Select";
import ToggleMode from "./components/ToggleMode";
import Search from "../../Components/Header/Search";

export default function Home() {
    const { clueMode } = useContext(UIContext);

    return (
        <div>
            <div className="text-center mb-3" id="Questions">
                <h2>
                    Bienvenue sur Clueless
                </h2>
                <p>
                    Une question ? N'hésitez pas. Clueless est l'endroit où vous trouverez votre réponse.
                </p>
                <p>
                    Posez une <span className="fw-bold text-primary">question</span> ou donnez une <span className="fw-bold text-success">astuce</span>, les deux sont possibles!
                </p>
            </div>
            <div className="d-flex flex-column h-100">
                <div className="d-flex flex-wrap align-items-center offset-1">
                    <ToggleMode />
                    <div className="searchContener col-11">
                        <Search />
                    </div>
                    <Select />
                </div>
                {
                    !clueMode ?
                    <div className="elmComponent offset-md-1 col-md-10 col-12" >
                        < Questions />
                    </div>
                    :
                    <div className="elmComponent offset-md-1 col-md-10 col-12" id="Clues">
                        < Clues />
                    </div>
                }
            </div>
        </div>
    )
}