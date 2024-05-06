import { useForm } from "react-hook-form";
import { fetchData } from "../../api/APIutils";
import { useSelector } from 'react-redux';
import React, { useState } from 'react';

export default function ForgottenPassword() {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [errorState, setErrorState] = useState("");
    const [successState, setSuccessState] = useState("");
    const [pendingState, setPendingState] = useState(false);
    const token = useSelector(state => state.user.token);
    const onSubmit = (data) => { setPendingState(true);
        fetchData(`forgot_password`, 'POST', loadData, token, data, errorData)};

    function loadData(data) {
        setErrorState("");
        setPendingState(false);
        setSuccessState(JSON.stringify(data));
    }

    function errorData(data) {
        setSuccessState("");
        setPendingState(false);
        setErrorState(JSON.stringify(data));
    }

    return (
        <div>
            <p className="mt-2">
                Vous avez oublié votre mot de passe ? Renseignez votre adresse email et nous vous l'enverrons par celui-ci.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-100">
                {errors.email?.type === "required" && (
                    <p className='mb-1 text-danger' role="alert">Email obligatoire</p>
                )}
                {errors.email?.type === "pattern" && (
                    <p className='mb-1 text-danger' role="alert">Ce n'est pas un email valide</p>
                )}
                <div className="d-flex mt-4">
                    <label htmlFor="email" className="me-2" >Votre email: </label>
                    <input type="email" id="email" {...register("email", { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ })} 
                                aria-invalid={errors.email ? "true" : "false"}  />
                </div>
                <p className="text-danger m-1 mt-3">
                    { errorState }
                </p>
                <p className="text-success m-1">
                    { successState }
                </p>
                <div>
                    < input type="submit" className={`buttonStyle mt-3 ${ pendingState && 'shine disabled'}`} />
                </div>
            </form>
        </div>
    )
}