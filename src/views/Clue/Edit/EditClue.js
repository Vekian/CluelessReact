import TextArea from "../../WriteNew/TextArea";
import VoteElement from "../../Question/VoteElement";
import { useEffect } from 'react';
import { loadingElm } from "../../../ui/UIutils"; 
import { useUpdateClueMutation } from "../../../features/api/clueSlice";
import { useForm } from "react-hook-form";
import { Comment } from 'react-loader-spinner';

export default function EditClue(props) {
    const [updateClue, { error, isLoading }] = useUpdateClueMutation();
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
        const resultClue = await updateClue({ id: props.data.id, token: props.user.token, body: JSON.stringify(data)});
        if (resultClue.data) {
            props.setEditClueState(false);
        }
    }

    useEffect(() => {
        register("content", { required: true, minLength: 20, maxLength: 2000 });
        setValue("content", props.data.content);
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
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
                            {
                                error && 
                                <p className='mb-1 text-danger' >
                                    Erreur lors de l'edit de la réponse, veuillez essayer plus tard
                                </p>
                            }
                        </div>
                    </div>
                    <div className="text-center">
                        <button className='buttonStyle mb-3 mt-5'>Soumettre</button>
                    </div>
                </>
            }
        </form>
    )
}