import { useForm } from "react-hook-form";
import { fetchData, getLvl } from "../../api/APIutils";
import { useDispatch } from 'react-redux';
import { loadUserProfil } from "../../features/user/userSlice";
import AddCategories from "./AddCategories";


function EditProfil(props) {
    const dispatch = useDispatch();
    const { register, formState: { errors }, handleSubmit } = useForm();
    const user = props.user;
    const userProfil = props.userProfil;
    const onSubmit = (data) => { sendData(data)};
    
    function loadData(data) {
        dispatch(loadUserProfil(data));
        props.setEditProfilState(!props.editProfilState)
    }

    function sendData(data) {
        data.age = parseInt(data.age);
        let tags = [];
        for (let category of userProfil.categories) {
            let tag = {
                category: `/api/categories/${category.id}`
            };
            tags.push(tag);
        }
        data.tags = tags;
        fetchData(`users/${user.id}`, 'PATCH', loadData, props.token, data);
    }

    return (
        <div>
            <div className="d-flex" >
                <form onSubmit={handleSubmit(onSubmit)} className="w-100">
                    <div className=" d-flex align-items-end">
                        <div  className="col-1 text-center">
                            <img  src={ process.env.REACT_APP_URL + userProfil.user.avatar} alt="avatar" height="80px" width="80px"/>
                        </div>
                        <div className="d-flex align-items-center  justify-content-between w-100 ms-3">
                            {errors.username?.type === "maxLength" && (
                                <p className='mb-1 text-danger' role="alert">Ne peut dépasser 100 caractères</p>
                            )}
                            {errors.username?.type === "minLength" && (
                                <p className='mb-1 text-danger' role="alert">Minimum 3 caractères</p>
                            )}
                            {errors.username?.type === "required" && (
                                <p className='mb-1 text-danger' role="alert">Email obligatoire</p>
                            )}
                            <div className=" d-flex align-items-end">
                                <label htmlFor="username"  className="me-2 fw-bold">
                                    Votre Pseudo: 
                                </label>
                                <input type="text" {...register("username", { required: true, maxLength: 20, minLength: 3 })} 
                                aria-invalid={errors.username ? "true" : "false"} defaultValue={userProfil.user.username} />
                                <h5 className=" ms-3">
                                    lvl {getLvl(userProfil.user.popularity)}
                                </h5>
                            </div>
                            <div>
                                <button className="bg-danger buttonStyle" onClick={() => props.setEditProfilState(!props.editProfilState)}>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-2">
                        <div className="d-flex col-4 flex-column  justify-content-center">
                            <div className="d-flex">
                                <label htmlFor="sex"  className="me-2 fw-bold">
                                    Votre genre: 
                                </label>
                                <select {...register("sex")}>
                                    { userProfil.user.sex === "homme" ? 
                                        <>
                                            <option key="homme" value="homme" defaultValue >Homme</option>
                                            <option key="femme" value="femme">Femme</option>
                                        </> 
                                        :
                                        <>
                                            <option key="homme" value="homme" >Homme</option>
                                            <option key="femme" value="femme" defaultValue>Femme</option>
                                        </> 
                                    }
                                </select>
                            </div>
                            {errors.username?.type === "max" && (
                                <p className='mb-1 text-danger' role="alert">Allons, vous n'êtes pas aussi vieux</p>
                            )}
                            {errors.username?.type === "min" && (
                                <p className='mb-1 text-danger' role="alert">Vous êtes un foetus ?</p>
                            )}
                            <div className=" d-flex align-items-end mb-3">
                                <label htmlFor="age"  className="me-2 fw-bold">
                                    Votre Âge: 
                                </label>
                                <input type="number" {...register("age", { min: 0, max: 120 })} 
                                aria-invalid={errors.country ? "true" : "false"} defaultValue={userProfil.user.age} />
                            </div>
                            <div className=" d-flex align-items-end">
                                <label htmlFor="country"  className="me-2 fw-bold">
                                    Votre Pays: 
                                </label>
                                <input type="text" {...register("country")} 
                                aria-invalid={errors.country ? "true" : "false"} defaultValue={userProfil.user.country} />
                            </div>
                        </div>
                        <div className="ms-4 col-6">
                            <label htmlFor="firstname"  className="me-2 mb-3 fw-bold">
                                Votre Prénom: 
                            </label>
                            <input type="text" {...register("firstname")} 
                            aria-invalid={errors.firstname ? "true" : "false"} defaultValue={userProfil.user.firstname} />
                            <label htmlFor="lastname"  className="me-2 mb-3 fw-bold">
                                Votre Nom de famille: 
                            </label>
                            <input type="text" {...register("lastname")} 
                            aria-invalid={errors.lastname ? "true" : "false"} defaultValue={userProfil.user.lastname} />
                            <div className="separator mb-3 ms-3"></div>
                            <div className="d-flex">
                                <label htmlFor="description"  className="me-2 fw-bold">
                                    Votre description: 
                                </label>
                                <input type="text" {...register("description")} 
                                aria-invalid={errors.description ? "true" : "false"} defaultValue={userProfil.user.description} />
                            </div> 
                        </div>
                    </div>
                    <div>
                        < AddCategories />
                    </div>
                    <input type="submit" className="buttonStyle mt-3" />
                </form>
            </div>
            
        </div>
    )
}

export default EditProfil;