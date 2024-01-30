import Questions from './Questions';
import Question from './Question';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Profil from './Profil';

function Main() {
    return(
        <div className='mainContent ps-5 pe-5'>
            <Routes>
                <Route path="/" element={< Questions />} />
                <Route path="/question/:id" element={< Question />} />
                <Route path="/profil/:id" element={< Profil />} />
            </Routes>
            <Login />
        </div>
    );
}

export default Main;