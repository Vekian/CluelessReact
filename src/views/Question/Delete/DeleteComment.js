import { useDeleteCommentMutation } from "../../../features/api/commentSlice"

export default function DeleteComment(props) {
    const [deleteComment] = useDeleteCommentMutation();
    const deleteCommentData = async () => {
        const resultDelete = await deleteComment({id: props.comment.id, token: props.user.token}); 
        if (resultDelete){
            props.refetch(props.idQuestion);
        }
    }

   return (
    <button className='buttonStyle-xs bg-danger ms-lg-4 ms-2' onClick={() => {deleteCommentData()}}>
        Supprimer
    </button>
   )
}