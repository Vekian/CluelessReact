import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { loadUserProfil, loadUserMe } from "../../features/user/userSlice";


function EditPicture(props) {
    const dispatch = useDispatch();
    const { register, formState: { errors }, handleSubmit } = useForm();
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("avatar", data.avatar[0]);
        fetch(`http://clueless.dvl.to/api/picture`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization' : `Bearer ${props.token}`,
              },
            body: formData
        })
        .then(response => {
        if (!response.ok) {
        }    
        return response.json()})
        .then(data => {
        loadData(data);

        })
    }
    
    function loadData(data) {
        dispatch(loadUserProfil(data));
        let newData = {...data, 'user_id': data.id};
        dispatch(loadUserMe(newData));
        props.setEditPictureState(!props.editPictureState);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="text-center">
            <div className="mb-3">
                {errors.avatar?.type === "required" && (
                    <p className='mb-1 text-danger' role="alert">Avatar obligatoire pour l'upload</p>
                )}
                <label htmlFor="avatar" className="form-label">Votre avatar</label>
                <input onInput={(e) => {
                    let reader = new FileReader();
                    reader.onload = function(event) {
                        props.setSourceState(event.target.result)
                    };
                    
                    reader.readAsDataURL(e.target.files[0]);
                    } } type="file" {...register("avatar", { required: true })} id="avatar"/>
            </div>
            <input type="submit" className="buttonStyle" />
            <button onClick={() => {
                props.setSourceState(process.env.REACT_APP_URL + props.userProfil.user.avatar);
                props.setEditPictureState(!props.editPictureState)}} className="buttonDanger ms-2">Annuler</button>
        </form>
    )
}

export default EditPicture;