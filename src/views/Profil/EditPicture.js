import { useForm } from "react-hook-form";
import { fetchData, getLvl } from "../../api/APIutils";
import { useDispatch } from 'react-redux';
import { loadUserProfil } from "../../features/user/userSlice";


function EditPicture(props) {
    const dispatch = useDispatch();
    const { register, formState: { errors }, handleSubmit } = useForm();
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("avatar", data.file[0]);
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
        props.setEditPictureState(!props.editPictureState)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="mb-3">
                {errors.avatar?.type === "required" && (
                    <p className='mb-1 text-danger' role="alert">Avatar obligatoire pour l'upload</p>
                )}
                <label htmlFor="avatar" className="form-label">Votre avatar</label>
                <input type="file" {...register("file", { required: true })} />
            </div>
            <input type="submit" className="buttonStyle mt-3" />
        </form>
    )
}

export default EditPicture;