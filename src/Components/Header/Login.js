import { loadToken, isTokenValid, loadUserMe } from '../../features/user/userSlice';
import { useDispatch} from 'react-redux';
import { fetchData } from '../../api/APIutils';
import { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    const dispatch = useDispatch();

    useEffect(() => {
        const cookie = getCookie('refresh_token');
        const body = {
            refresh_token: cookie
        }
        const bodyJson = JSON.stringify(body);

        fetch(`http://clueless.dvl.to/api/token/refresh`, 
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: bodyJson
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response)
            }    
            return response.json()})
            .then(data => {
                if (data.token) {
                    dispatch(loadToken(data.token));
                    dispatch(isTokenValid(true));
                    dispatch(loadUserMe(data.user));
                }
            })
    }, [])

    function loginForm(event) {
        event.preventDefault();
        const body = {
            "username" : document.getElementById("username").value,
            "password" : document.getElementById("password").value
        }

        fetchData('login_check', 'POST', loadData, '', body);
        
    }

    function getCookie(name){
        if(document.cookie.length == 0)
          return null;
   
        var regSepCookie = new RegExp('(; )', 'g');
        var cookies = document.cookie.split(regSepCookie);
   
        for(var i = 0; i < cookies.length; i++){
          var regInfo = new RegExp('=', 'g');
          var infos = cookies[i].split(regInfo);
          if(infos[0] == name){
            return unescape(infos[1]);
          }
        }
        return null;
      }
    
    function loadData(data) {
        if (data.token) {
            dispatch(loadToken(data.token));
            dispatch(isTokenValid(true));
            dispatch(loadUserMe(data.user));

            const cookie = `refresh_token=${data['refresh_token']}`;
            document.cookie = cookie;
        }
    }


    

    return (
        <div>
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content d-flex align-items-center">
                        <div className="modal-header offset-4 col-8">
                            <h5 className="modal-title" id="loginModalLabel">Connectez vous</h5>
                            <div className='d-flex justify-content-end'>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        </div>
                        <div className="modal-body d-flex flex-column align-items-center">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    console.log(credentialResponse);
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                            <form method="POST" className="d-flex flex-column align-items-center justify-content-center">
                                <div className="mb-3">
                                    <label htmlFor="username"  className="me-2">
                                        Votre email: 
                                    </label>
                                    <input type="text" name="username" id="username" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="me-2">
                                        Votre mot de passe: 
                                    </label>
                                    <input type="password" name="password" id="password" />
                                </div>
                            </form>
                            <button type="button" className="buttonStyle mt-3" data-bs-dismiss="modal" onClick={event => loginForm(event)}>Se connecter</button>
                            <h5 className="modal-title" id="loginModalLabel">Pas encore inscrit ? C'est par <u>ici</u></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Login;