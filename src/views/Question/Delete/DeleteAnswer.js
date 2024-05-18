import { useDeleteAnswerMutation } from "../../../features/api/answerSlice";

export default function DeleteAnswer(props) {
    const [deleteAnswer] = useDeleteAnswerMutation();
    const deleteAnswerData = async () => {
        const resultDelete = await deleteAnswer({id: props.answer.id, token: props.user.token}); 
        if (resultDelete){
            props.refetch(props.idQuestion);
        }
    }

   return (
    <button className='buttonStyle ms-lg-4 ms-1 bg-danger' onClick={() => {deleteAnswerData()}}>
        Supprimer
    </button>
   )
}