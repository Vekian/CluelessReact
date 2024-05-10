import './Settings.css';
import Account from './Account';
import Subscription from './Subscription';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

export default function Settings() {
    const location = useLocation();
    
    return (
        <div className="ms-3 mt-3">
            <h2>
                Paramètres
            </h2>
            <div className='d-flex'>
            <Link to="/settings/" style={{ color: 'inherit', textDecoration: 'inherit'}} className={`linkSettings ${location.pathname === "/settings/" && "active"}`} >
                <h4 className='me-3'>
                    Compte
                </h4>
            </Link>
            <Link to="/settings/subscription" style={{ color: 'inherit', textDecoration: 'inherit'}} className={`linkSettings ${location.pathname === "/settings/subscription" && "active"}`}>
                <h4>
                    Abonnement
                </h4>
            </Link>    
            </div>
            <div>
                < Routes>
                    <Route path="/" element={< Account />} />
                    <Route path="/subscription" element={< Subscription />} />
                </Routes>
            </div>
        </div>
    )
}