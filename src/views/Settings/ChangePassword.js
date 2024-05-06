import { useForm } from "react-hook-form";
import { fetchData } from "../../api/APIutils";
import { useSelector } from 'react-redux';
import React, { useState } from 'react';

export default function ChangePassword(){
    const { register, formState: { errors }, watch, handleSubmit } = useForm();
    const [errorState, setErrorState] = useState("");
    const [successState, setSuccessState] = useState("");
    const [pendingState, setPendingState] = useState(false);
    const onSubmit = (data) => { setPendingState(true);
        fetchData(`change_password`, 'POST', loadData, token, data, errorData)};
    const password = watch("newPassword", "");
    const token = useSelector(state => state.user.token);
    
    function loadData(data) {
        setErrorState("");
        setSuccessState(JSON.stringify(data));
    }

    function errorData(data) {
        setSuccessState("");
        setErrorState(JSON.stringify(data));
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-100">
                <div className="d-flex mt-3">
                    <label htmlFor="password" className="me-2" >Ancien mot de passe: </label>
                    <input type="password" id="password" {...register("password", { required: true })} 
                                aria-invalid={errors.password ? "true" : "false"}  />
                </div>
                {errors.password?.type === "required" && (
                    <p className='mb-1 text-danger' role="alert">Ancien mot de passe obligatoire</p>
                )}
                <div className="d-flex mt-3">
                    <label htmlFor="newPassword" className="me-2" >Nouveau mot de passe: </label>
                    <input type="password" id="newPassword" {...register("newPassword", { required: true, pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z]).{6,}$/ })} 
                                aria-invalid={errors.newPassword ? "true" : "false"}  />
                </div>
                {errors.newPassword?.type === "required" && (
                    <p className='mb-1 text-danger' role="alert">Champ obligatoire</p>
                )}
                {errors.newPassword?.type === "pattern" && (
                    <p className='mb-1 text-danger' role="alert">Le mot de passe doit contenir au moins 6 caractères, dont une lettre, un chiffre et une majuscule</p>
                )}
                <div className="d-flex mt-3">
                    <label htmlFor="newPassword2" className="me-2" >Confirmer le nouveau mot de passe: </label>
                    <input type="password" id="newPassword2" {...register("newPassword2", 
                    { required: true, 
                        pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z]).{6,}$/, 
                        validate: (value) => value === password 
                    })} 
                                aria-invalid={errors.newPassword2 ? "true" : "false"}  />
                </div>
                {errors.newPassword2?.type === "required" && (
                    <p className='mb-1 text-danger' role="alert">Champ obligatoire</p>
                )}
                {errors.newPassword2?.type === "pattern" && (
                    <p className='mb-1 text-danger' role="alert">Le mot de passe doit contenir au moins 6 caractères, dont une lettre, un chiffre et une majuscule</p>
                )}
                {errors.newPassword2?.type === "validate" && (
                    <p className='mb-1 text-danger' role="alert">Les deux nouveaux mots de passes doivent être identiques</p>
                )}
                <p className="text-danger fw-bold mt-3">
                    { errorState }
                </p>
                <p className="text-success fw-bold mt-3">
                    { successState }
                </p>
                {
                    pendingState ?
                    <div>

                    </div>
                    :
                    < input type="submit" className="buttonStyle mt-3" />
                }
            </form>
        </div>
    )
}