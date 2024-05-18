import { useDeleteQuestionMutation } from "../../../features/api/questionSlice";
import { useNavigate } from 'react-router-dom';

export default function DeleteQuestion(props) {
    const navigate = useNavigate();
    const [deleteQuestion] = useDeleteQuestionMutation();

    return (
        <button className='buttonStyle  ms-3 bg-danger' onClick={() => {deleteQuestion({id: props.data.id, token: props.user.token}); navigate('/'); }}>
            Supprimer
        </button>
    )
}