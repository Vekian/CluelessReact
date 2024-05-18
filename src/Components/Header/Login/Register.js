import { useForm } from "react-hook-form";
import { fetchData } from '../../../api/APIutils';

export default function Register(props) {
    const { register, watch, formState: { errors }, handleSubmit } = useForm();
    const onSubmitSignIn = (data) => { props.setIsSending(true)
        fetchData('register', 'POST', props.loadData, '', data)};
    
    return(
        <div className="text-center">
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
                {errors.pseudo?.type === "maxLength" && (
                    <p className='mb-1 text-danger' role="alert">Ne peut dépasser 20 caractères</p>
                )}
                {errors.pseudo?.type === "minLength" && (
                    <p className='mb-1 text-danger' role="alert">Doit posséder au moins 3 caractères</p>
                )}
                {errors.pseudo?.type === "required" && (
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
        </div>
    )
}