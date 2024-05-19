import { useDeleteClueMutation } from "../../../features/api/clueSlice";
import { useNavigate } from 'react-router-dom';

export default function DeleteClue(props) {
    const navigate = useNavigate();
    const [deleteClue] = useDeleteClueMutation();

    return (
        <button className='buttonStyle  ms-3 bg-danger' onClick={() => {deleteClue({id: props.data.id, token: props.user.token}); navigate('/'); }}>
            Supprimer
        </button>
    )
}