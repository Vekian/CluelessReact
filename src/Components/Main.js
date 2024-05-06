import './Main.css';
import Question from '../views/Question/Question';
import { Routes, Route } from 'react-router-dom';
import Profil from '../views/Profil/Profil';
import Editor from '../views/WriteNew/Editor';
import Home from '../views/Home/Home';
import Clue from '../views/Clue/Clue';
import Settings from '../views/Settings/Settings';
import Rankings from '../views/Rankings/Rankings';
import Helpers from '../views/Helpers/Helpers';
import Help from '../views/Help/Help';
import Premium from '../views/Premium/Premium';

export default function Main() {
    return(
        <div className='mainContent ps-xxl-5 ps-1 pe-xxl-5 pe-1'>
            <Routes>
                <Route path="/" element={< Home />} />
                <Route path="/question/:id" element={< Question />} />
                <Route path="/clue/:id" element={< Clue />} />
                <Route path="/profils/:id" element={< Profil />} />
                <Route path="/profil" element={< Profil />} />
                <Route path="/settings" element={< Settings />} />
                <Route path="/rankings" element={< Rankings />} />
                <Route path="/helpers" element={< Helpers />} />
                <Route path="/help" element={< Help />} />
                <Route path="/premium" element={< Premium />} />
                <Route path="/create/question" element={< Editor type={"question"} />} />
                <Route path="/create/clue" element={< Editor type={"clue"} />} />
            </Routes>
        </div>
    );
}