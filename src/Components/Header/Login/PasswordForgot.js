import { useForm } from "react-hook-form";
import { useState } from 'react';
import { Comment } from 'react-loader-spinner';

export default function PasswordForgot(props) {
    const { register, formState: { errors }, handleSubmit } = useForm()
    const onSubmit = (data) => fetchData(data);
    const [isSent, setIsSent] = useState( "" );
    const [isSending, setIsSending] = useState( false );

    function fetchData(data) {
        setIsSending(true);
        fetch(`${process.env.REACT_APP_URL}forgot_password_anonymous`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json'
                        },
                        body: JSON.stringify(data)
                    }
                )
                .then(response => {
                    if (!response.ok) {
                        console.log('erreur')
                    }    
                    return response.json()})
                .then(data => {
                    setIsSending(false);
                    setIsSent(data);
                    setTimeout(() => {
                        props.setIsPasswordForgot(false);
                    }, 2000);
                })
                .catch((err) => console.log(err))
    }
    
    return (
        <div className="modal-body d-flex flex-column align-items-center">
            <p className="text-center">
                Indiquez le mail et le pseudo de votre compte. <br />Si celui-ci existe, un nouveau mot de passe vous sera envoyé par email.
            </p>
            {
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
                <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center justify-content-center">
                    {errors.email?.type === "maxLength" && (
                        <p className='mb-1 text-danger' role="alert">Ne peut dépasser 100 caractères</p>
                    )}
                    {errors.email?.type === "required" && (
                        <p className='mb-1 text-danger' role="alert">Email obligatoire</p>
                    )}
                    {errors.email?.type === "pattern" && (
                        <p className='mb-1 text-danger' role="alert">Il doit s'agir d'un email</p>
                    )}
                    <div>
                        <label htmlFor="email"  className="me-2">
                            Votre email: 
                        </label>
                        <input className='mb-2' {...register("email", { required: true, maxLength: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} 
                        aria-invalid={errors.email ? "true" : "false"}
                        />
                    </div>
                    {errors.username?.type === "maxLength" && (
                        <p className='mb-1 text-danger' role="alert">Ne peut dépasser 100 caractères</p>
                    )}
                    {errors.username?.type === "required" && (
                        <p className='mb-1 text-danger' role="alert">Pseudo obligatoire</p>
                    )}
                    <div>
                        <label htmlFor="username"  className="me-2">
                            Votre pseudo: 
                        </label>
                        <input className='mb-2' {...register("username", { required: true, maxLength: 100 })} 
                        aria-invalid={errors.username ? "true" : "false"}
                        />
                    </div>
                    <br />
                    <span className="text-success">
                        { isSent }
                    </span>
                    <input type="submit" className="buttonStyle mt-3" />
                </form>
            }
            
        </div>
    )
}