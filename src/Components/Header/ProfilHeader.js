import { getLvl } from '../../api/APIutils' ;
import { Link } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { deleteUserMe} from '../../features/user/userSlice';
import { useContext } from "react";
import { UIContext } from '../UIProvider';
import { googleLogout } from '@react-oauth/google';

function ProfilHeader (props) {
    const dispatch = useDispatch();
    const {toggleDarkMode} = useContext(UIContext);


    function deleteCookie() {
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'; 
    }


    function logOut(){
        dispatch(deleteUserMe());
        deleteCookie();
        googleLogout();
    }

    return (
        <div className="d-flex align-items-center w-100">
            <div className="btn-group w-100">
                <div type="button" className="buttonProfil d-flex align-items-center dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={ process.env.REACT_APP_URL_IMG + props.user.avatar} alt="avatar"  className='me-2 avatar' />
                    <div className='me-2'>
                       <h5>{props.user.username}</h5> 
                       <h6 >
                            Lvl {getLvl(props.user.popularity)}
                       </h6>
                    </div>
                </div>
                <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to={`/profil`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Voir profil</Link></li>
                    <li className="dropdown-item" onClick={toggleDarkMode}>DarkMode</li>
                    <li><Link className="dropdown-item" to={`/settings`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Paramètres</Link></li>
                    <li className='dropdown-item' onClick={event => logOut()}>
                        Se déconnecter
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ProfilHeader;