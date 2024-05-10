import ChangePassword from './ChangePassword';
import ForgottenPassword from './ForgottenPassword';


export default function Account(){
    return (
        <div>
             <div className='settingsItem'>
                <h4>
                    Changer de mot de passe
                </h4>
                < ChangePassword />
            </div>
            <div className='settingsItem mt-3'>
                <h4>
                    Mot de passe oublié
                </h4>
                < ForgottenPassword />
            </div>
        </div>
    )
}