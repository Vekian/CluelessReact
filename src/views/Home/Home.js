import Questions from "./components/Questions";
import './Home.css';
import Clues from "./components/Clues";

function Home() {

    return (
        <div>
            <div className="text-center mb-3">
                <h2>
                    Bienvenue sur Clueless
                </h2>
                <p>
                    Une question ? N'hésitez pas. Clueless est l'endroit où vous trouverez votre réponse.
                </p>
            </div>
            <div className="d-flex flex-row flex-wrap h-100">
                <div className="elmComponent col-xxl-6 offset-xxl-0 offset-1 col-10">
                    < Questions />
                </div>
                <div className="elmComponent col-xxl-6 offset-xxl-0 offset-1 col-10">
                    < Clues />
                </div>
                
            </div>
        </div>
    )
}

export default Home;