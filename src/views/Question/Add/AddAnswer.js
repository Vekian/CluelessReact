import TextArea from "../../WriteNew/TextArea";
import { useEffect } from 'react';
import { useAddAnswerMutation } from "../../../features/api/answerSlice";
import { useForm } from "react-hook-form"
import { Comment } from 'react-loader-spinner';

export default function AddAnswer(props) {
    const [addAnswer, { error, isLoading }] = useAddAnswerMutation();
    const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm();
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
    const onSubmit = async (data) => {
        const body = {
            content: data.content,
            user: `/api/users/${props.user.user.id}`,
            question: `/api/questions/${props.data.id}`,
        }
        const resultAnswer = await addAnswer({body: JSON.stringify(body), token: props.user.token});
        if (resultAnswer.data) {
            props.setIdEditor(`answerElm${resultAnswer.data.id}`);
            props.refetch(props.data.id);
        } 
    }

    useEffect(() => {
        register("content", { required: true, minLength: 20, maxLength: 2000 });
    }, [register]);

    return (
        <div>
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
                    <div className='d-flex flex-column align-items-center'>
                        < TextArea id={"answer"} content={editorContent} setContent={onEditorStateChange} class={'answer'}/>
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
                                Erreur lors de l'envoi de la réponse, veuillez essayer plus tard
                            </p>
                        }
                        <button className='buttonStyle' onClick={handleSubmit(onSubmit)}>Envoyer la réponse</button> 
                    </div>
                }
        </div>
    )
}