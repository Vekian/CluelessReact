import { loadToken, isTokenValid, loadUserMe } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../api/APIutils';

function Login() {
    const dispatch = useDispatch();

    function loginForm(event) {
        event.preventDefault();
        const body = {
            "username" : document.getElementById("username").value,
            "password" : document.getElementById("password").value
        }

        fetchData('login_check', 'POST', loadData, '', body);
    }

    function loadData(data) {
        if (data.token) {
            dispatch(loadToken(data.token));
            dispatch(isTokenValid(true));
            dispatch(loadUserMe(data.user));
        }
        
    }



    return (
        <div>
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loginModalLabel">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form method="POST" className="d-flex flex-column align-items-center justify-content-center">
                            <div className="mb-3">
                                <label htmlFor="username"  className="me-2">
                                    Votre pseudo: 
                                </label>
                                <input type="text" name="username" id="username" />
                            </div>
                            <div>
                                <label htmlFor="password" className="me-2">
                                    Votre mot de passe: 
                                </label>
                                <input type="text" name="password" id="password" />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={event => loginForm(event)}>Se connecter</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Login;