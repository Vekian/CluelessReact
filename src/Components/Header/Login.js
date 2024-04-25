import { loadToken, loadUserMe } from '../../features/user/userSlice';
import { useDispatch} from 'react-redux';
import { fetchData } from '../../api/APIutils';
import { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useForm } from "react-hook-form"

function Login() {
    const dispatch = useDispatch();
    const [isSigning, setIsSigning] = useState( false );
    const loginGoogle = useGoogleLogin({
        onSuccess: (codeResponse) => sendAccesTokenGoogle(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    const { register, watch, formState: { errors }, handleSubmit } = useForm()
    const onSubmit = (data) => fetchData('login_check', 'POST', loadData, '', data)
    const onSubmitSignIn = (data) => fetchData('register', 'POST', loadData, '', data)


    useEffect(() => {
        const cookie = getCookie('refresh_token');
        if (cookie){
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
                    return response.json()
                })
                .then(data => {
                    if (data.token) {
                        dispatch(loadToken(data.token));
                        const userJson = JSON.parse(data.user);
                        dispatch(loadUserMe(userJson));
                    }
                })
        }
        
    }, [])

    function sendAccesTokenGoogle(user){
        fetch(`http://clueless.dvl.to/googlelogin`,
                    {
                        methode: 'GET',
                        headers: {
                            authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    }
                )
                .then(response => {
                    if (!response.ok) {
                        console.log('erreur')
                    }    
                    return response.json()})
                .then(data => {
                    loadData(data);
                })
                .catch((err) => console.log(err))
    }
    
    function loadData(data) {
        if (data.token) {
            dispatch(loadToken(data.token));
            const userJson = JSON.parse(data.user);
            dispatch(loadUserMe(userJson));

            const cookie = `refresh_token=${data['refresh_token']}`;
            document.cookie = cookie;
            document.getElementById('loginModalClose').click()
        }
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

    return (
        <div>
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content d-flex align-items-center">
                        <div className="modal-header offset-4 col-8">
                            <h5 className="modal-title" id="loginModalLabel">{ !isSigning && "Connectez vous"}</h5>
                            <div className='d-flex justify-content-end'>
                                <button type="button" className="btn-close" id="loginModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        </div>
                        { isSigning ? 
                            <div className="modal-body d-flex flex-column align-items-center">
                                <h4 className='mb-2'>
                                    Inscrivez-vous avec google
                                </h4>       
                                <button onClick={loginGoogle} data-bs-dismiss="modal" className="googleButton mb-4">S'inscrire avec Google  </button>
                                <h4 className='mb-2'>
                                    Ou avec votre email
                                </h4>
                                <form onSubmit={handleSubmit(onSubmitSignIn)} className="d-flex flex-column align-items-center justify-content-center">
                                    {errors.username?.type === "maxLength" && (
                                        <p className='mb-1 text-danger' role="alert">Ne peut dépasser 100 caractères</p>
                                    )}
                                    {errors.username?.type === "required" && (
                                        <p className='mb-1 text-danger' role="alert">Email obligatoire</p>
                                    )}
                                    {errors.username?.type === "pattern" && (
                                        <p className='mb-1 text-danger' role="alert">Il doit s'agir d'un email</p>
                                    )}
                                    <div className="mb-3">
                                        <label htmlFor="username"  className="me-2">
                                            Votre email: 
                                        </label>
                                        <input type="text" {...register("username", { required: true, maxLength: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} 
                                        aria-invalid={errors.username ? "true" : "false"}/>
                                    </div>
                                    {errors.username?.type === "maxLength" && (
                                        <p className='mb-1 text-danger' role="alert">Ne peut dépasser 20 caractères</p>
                                    )}
                                    {errors.username?.type === "minLength" && (
                                        <p className='mb-1 text-danger' role="alert">Doit posséder au moins 3 caractères</p>
                                    )}
                                    {errors.username?.type === "required" && (
                                        <p className='mb-1 text-danger' role="alert">Pseudo obligatoire</p>
                                    )}
                                    <div className="mb-3">
                                        <label htmlFor="pseudo"  className="me-2">
                                            Votre pseudo: 
                                        </label>
                                        <input type="text" {...register("pseudo", { required: true, maxLength: 20, minLength: 3 })} 
                                        aria-invalid={errors.pseudo ? "true" : "false"}/>
                                    </div>
                                    {errors.password?.type === "minLength" && (
                                        <p className='mb-1 text-danger' role="alert">8 caractères minimum</p>
                                    )}
                                    {errors.password?.type === "required" && (
                                        <p className='mb-1 text-danger' role="alert">Mot de passe obligatoire</p>
                                    )}
                                    <div>
                                        <label htmlFor="password" className="me-2 mb-3">
                                            Votre mot de passe: 
                                        </label>
                                        <input type="password" {...register("password", { required: true, minLength: 8 })} />
                                    </div>
                                    {errors.password2?.type === "minLength" && (
                                        <p className='mb-1  text-danger' role="alert">8 caractères minimum</p>
                                    )}
                                    {errors.password2?.type === "required" && (
                                        <p className='mb-1  text-danger' role="alert">Mot de passe obligatoire</p>
                                    )}
                                    <div>
                                        <label htmlFor="password2" className="me-2">
                                            Confirmer le mot de passe: 
                                        </label>
                                        <input type="password" {...register("password2", { validate: value => value === watch('password') || "Les mots de passe ne correspondent pas", required: true, minLength: 8 })} />
                                    </div>
                                    {errors.password2?.type === 'validate' && (
                                        <p className='mt-1 text-danger' role="alert">{errors.password2.message}</p>
                                    )}
                                    <input type="submit" className="buttonStyle mt-3" />
                                </form>
                                <h5 className="modal-title" id="loginModalLabel">Se connecter ? C'est par <u className='linkSigning' onClick={() => setIsSigning(false)}>ici</u></h5>
                            </div>
                            :
                            <div className="modal-body d-flex flex-column align-items-center">       
                                <button onClick={loginGoogle} data-bs-dismiss="modal" className="googleButton mb-3">Se connecter avec Google  </button>
                                <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center justify-content-center">
                                    {errors.username?.type === "maxLength" && (
                                        <p className='mb-1 text-danger' role="alert">Ne peut dépasser 100 caractères</p>
                                    )}
                                    {errors.username?.type === "required" && (
                                        <p className='mb-1 text-danger' role="alert">Email obligatoire</p>
                                    )}
                                    {errors.username?.type === "pattern" && (
                                        <p className='mb-1 text-danger' role="alert">Il doit s'agir d'un email</p>
                                    )}
                                    <div>
                                        <label htmlFor="username"  className="me-2">
                                            Votre email: 
                                        </label>
                                        <input className='mb-2' {...register("username", { required: true, maxLength: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} 
                                        aria-invalid={errors.username ? "true" : "false"}
                                        />
                                    </div>
                                    {errors.password?.type === "minLength" && (
                                        <p className='mb-1 text-danger' role="alert">8 caractères minimum</p>
                                    )}
                                    {errors.password?.type === "required" && (
                                        <p className='mb-1 text-danger' role="alert">Mot de passe obligatoire</p>
                                    )}
                                    <div>
                                        <label htmlFor="password"  className="me-2">
                                            Votre mot de passe: 
                                        </label>
                                        <input type="password" {...register("password", { required: true, minLength: 8 })}/>
                                    </div>
                                    <input type="submit" className="buttonStyle mt-3" />
                                </form>
                                <h5 className="modal-title" id="loginModalLabel">Pas encore inscrit ? C'est par <u className='linkSigning' onClick={() => setIsSigning(true)}>ici</u></h5>
                            </div>
                        }
                    </div>
                </div>
            </div>
            
        </div>
    )
    
}

export default Login;