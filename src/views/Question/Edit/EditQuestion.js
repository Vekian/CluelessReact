import TextArea from "../../WriteNew/TextArea";
import VoteElement from "../VoteElement";
import { useEffect } from 'react';
import { loadingElm } from "../../../ui/UIutils"; 
import { useUpdateQuestionMutation } from "../../../features/api/questionSlice"; 
import { useForm } from "react-hook-form"


export default function EditQuestion(props){
    const [updateQuestion] = useUpdateQuestionMutation();
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
    const onSubmit = (data) => {
        props.setEditQuestionState(false);
        updateQuestion({ id: props.data.id, token: props.user.token, body: JSON.stringify(data)});}

    useEffect(() => {
        register("content", { required: true, minLength: 20, maxLength: 2000 });
        setValue("content", props.data.content);
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div>
                <h3 className="titleQuestion offset-1">
                    {errors.title?.type === "maxLength" && (
                        <p className='mb-1 text-danger' role="alert">Ne peut dépasser 100 caractères</p>
                    )}
                    {errors.title?.type === "required" && (
                        <p className='mb-1 text-danger' role="alert">Titre obligatoire</p>
                    )}
                    <input type="text" id='titleQuestion' defaultValue={props.data.title} {...register("title", { required: true, maxLength: 100 })} 
                        aria-invalid={errors.title ? "true" : "false"}
                    />
                </h3>
            </div>
            <span className="separator w-100"></span>
            <div className="d-flex w-100">
                {props.isLoading ? 
                    loadingElm()
                    :
                    < VoteElement refetch={props.refetch} class1={"question"} class2={"mt-3 mb-3"}  idAuthor={props.data.user.id} popularity={props.data.popularity} typeParent={"question"} idParentElm={props.data.id} idElm={`/api/questions/${props.data.id}`} />
                }
                <div className='d-flex flex-column align-items-start w-100'>
                    {props.isLoading && editorContent ? 
                        loadingElm()
                        :
                        < TextArea id = {"question"} content={editorContent} setContent={onEditorStateChange} />
                    }
                    {errors.content?.type === "minLength" && (
                        <p className='mb-1 text-danger' role="alert">Doit avoir au minimum 20 caractères</p>
                    )}
                    {errors.content?.type === "maxLength" && (
                        <p className='mb-1 text-danger' role="alert">Ne peut dépasser 2 000 caractères</p>
                    )}
                    {errors.content?.type === "required" && (
                        <p className='mb-1 text-danger' role="alert">Contenu obligatoire</p>
                    )}
                </div>
            </div>
            <div className="text-center">
                <button className='buttonStyle mb-3 mt-5'>Soumettre</button>
            </div>
        </form>
        
    )
}