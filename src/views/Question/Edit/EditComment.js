import { useUpdateCommentMutation } from "../../../features/api/commentSlice";
import TextArea from "../../WriteNew/TextArea";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Comment } from 'react-loader-spinner';


export default function EditComment(props) {
    const [updateComment, { error, isLoading }] = useUpdateCommentMutation();
    const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm()
    const editorContent = watch("content");
    const onEditorStateChange = (editorState) => {
        const cleanedContent = editorState.replace(/<p><br><\/p>/g, '').trim();
        if (cleanedContent === "") {
            setValue("content", "");
        }
        else {
           setValue("content", editorState); 
        }
      };
    const onSubmit = async(data) => {
        const resultComment = await updateComment({ id: props.data.id, token: props.user.token, body: JSON.stringify(data)});
        if (resultComment.data) {
            props.setEditCommentState(false);
            props.refetch(props.idQuestion);
        }
    }

    useEffect(() => {
        register("content", { required: true, minLength: 20, maxLength: 2000 });
        setValue("content", props.data.content);
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)}  >
            {
                isLoading ? 
                <div className='d-flex justify-content-center align-items-center h-100'>
                    <Comment
                        visible={true}
                        height="120"
                        width="120"
                        ariaLabel="comment-loading"
                        wrapperStyle={{}}
                        wrapperClass="comment-wrapper"
                        color="#fff"
                        backgroundColor="var(--tertiaryColor)"
                    />
                </div>
                :
                <>
                    <div className='d-flex flex-column align-items-center'>
                        < TextArea id = {"comment"} content={editorContent} setContent={onEditorStateChange} />
                        {errors.content?.type === "minLength" && (
                            <p className='mb-1 text-danger' role="alert">Doit avoir au minimum 20 caractères</p>
                        )}
                        {errors.content?.type === "maxLength" && (
                            <p className='mb-1 text-danger' role="alert">Ne peut dépasser 2 000 caractères</p>
                        )}
                        {errors.content?.type === "required" && (
                            <p className='mb-1 text-danger' role="alert">Contenu obligatoire</p>
                        )}
                        {
                            error && 
                            <p className='mb-1 text-danger' >
                                Erreur lors de l'edit de la réponse, veuillez essayer plus tard
                            </p>
                        }
                    </div>
                    <div className="text-center">
                        <button className='buttonStyle mb-3'>Soumettre</button>
                    </div>
                </>
            }
        </form>
    )
    
}