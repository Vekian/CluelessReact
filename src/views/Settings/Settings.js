import './Settings.css';
import ChangePassword from './ChangePassword';

function Settings() {
    
    return (
        <div className="ms-3 mt-3">
            <h2>
                Paramètres
            </h2>
            <div className='settingsItem'>
                <h4>
                    Changer de mot de passe
                </h4>
                < ChangePassword />
            </div>
        </div>
    )
}

export default Settings;