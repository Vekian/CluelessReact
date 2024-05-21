import { loadToken, loadUserMe } from '../../../features/user/userSlice';
import { useDispatch} from 'react-redux';
import { fetchData, getCookie } from '../../../api/APIutils';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form"
import GoogleLogin from './GoogleLogin';
import Register from './Register';
import PasswordForgot from './PasswordForgot';
import { Comment } from 'react-loader-spinner';

export default function Login() {
    const dispatch = useDispatch();
    const [isSigning, setIsSigning] = useState( false );
    const [isPasswordForgot, setIsPasswordForgot] = useState( false );
    const [isSending, setIsSending] = useState( false );
    const [error, setError] = useState( "" );

    const { register, formState: { errors }, handleSubmit } = useForm()
    const onSubmit = (data) => {
                                setIsSending(true);
                                fetchData('login_check', 'POST', loadData, '', data, errorData)}
    
    useEffect(() => {
        const cookie = getCookie('refresh_token');
        if (cookie){
            const body = {
                refresh_token: cookie
            }
            fetchData('token/refresh', 'POST', loadData, '', body)
        }
        
    }, [])
    
    function loadData(data) {
        if (data.token) {
            dispatch(loadToken(data.token));
            const userJson = JSON.parse(data.user);
            dispatch(loadUserMe(userJson));

            let cookie = getCookie('refresh_token');
            if (!cookie) {
                cookie = `refresh_token=1`;
                document.cookie = cookie;
                document.getElementById('loginModalClose').click()
                setIsSending(false);
            }
        }
    }

    function errorData(data) {
        setIsSending(false);
        setError("Erreur d'identifiants");
    }

    return (
        <div>
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content d-flex align-items-center">
                        <div className="modal-header offset-4 col-8">
                            <h5 className="modal-title" id="loginModalLabel">{ isPasswordForgot ? "Mot de passe oublié"  : !isSigning && "Connectez vous"}{ isSigning && "Inscrivez vous"}</h5>
                            <div className='d-flex justify-content-end'>
                                <button type="button" className="btn-close" id="loginModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        </div>
                        {
                            isPasswordForgot ?
                            < PasswordForgot setIsPasswordForgot={setIsPasswordForgot} />
                            :
                                isSending ?
                                    <Comment
                                        visible={true}
                                        height="80"
                                        width="80"
                                        ariaLabel="comment-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="comment-wrapper"
                                        color="#fff"
                                        backgroundColor="var(--tertiaryColor)"
                                    />
                                :
                                isSigning ? 
                                    <div className="modal-body d-flex flex-column align-items-center">
                                        <h4 className='mb-2'>
                                            Inscrivez-vous avec google
                                        </h4>       
                                        < GoogleLogin loadData={loadData} text={"Inscrivez vous avec Google"} />
                                        < Register loadData= {loadData} setIsSending={setIsSending} />
                                        <h5 className="modal-title" id="loginModalLabel">Se connecter ? C'est par <u className='linkSigning' onClick={() => setIsSigning(false)}>ici</u></h5>
                                    </div>
                                    :
                                    <div className="modal-body d-flex flex-column align-items-center">       
                                        < GoogleLogin loadData={loadData} text={"Connectez vous avec Google"} />
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
                                                <input type="email" className='mb-2' {...register("username", { required: true, maxLength: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} 
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
                                            <br />
                                            <span className='text-danger mt-2'>
                                                { error }
                                            </span>
                                            
                                            <input type="submit" className="buttonStyle mt-1" />
                                        </form>
                                        <h5 className="modal-title" id="loginModalLabel">Pas encore inscrit ? C'est par <u className='linkSigning' onClick={() => setIsSigning(true)}>ici</u></h5>
                                        <h5 className="modal-title" id="loginModalLabel">Mot de passe oublié ? Récupérez le <u className='linkSigning' onClick={() => setIsPasswordForgot(true)}>ici</u></h5>
                                    </div>
                        }
                    </div>
                </div>
            </div>
            
        </div>
    )
    
}