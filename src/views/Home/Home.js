import Questions from "./components/Questions";
import './Home.css';
import Clues from "./components/Clues";

function Home() {

    return (
        <div className="d-flex flex-row flex-wrap h-100">
            <div className="elmComponent col-xxl-7 offset-xxl-0 offset-1 col-10">
                < Questions />
            </div>
            <div className="elmComponent col-xxl-5 offset-xxl-0 offset-1 col-10">
                < Clues />
            </div>
            
        </div>
    )
}

export default Home;