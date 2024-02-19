import './Main.css';
import Question from '../views/Question/Question';
import { Routes, Route } from 'react-router-dom';
import Profil from '../views/Profil/Profil';
import Editor from '../views/WriteNew/Editor';
import Home from '../views/Home/Home';
import Clue from '../views/Clue/Clue';

function Main() {
    return(
        <div className='mainContent ps-xxl-5 ps-1 pe-xxl-5 pe-1'>
            <Routes>
                <Route path="/" element={< Home />} />
                <Route path="/question/:id" element={< Question />} />
                <Route path="/clue/:id" element={< Clue />} />
                <Route path="/profils/:id" element={< Profil />} />
                <Route path="/profil" element={< Profil />} />
                <Route path="/create/question" element={< Editor type={"question"} />} />
                <Route path="/create/clue" element={< Editor type={"clue"} />} />
            </Routes>
        </div>
    );
}

export default Main;