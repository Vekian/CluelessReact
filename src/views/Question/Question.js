import './Question.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDateDetail, getLvl} from '../../api/APIutils' ;
import { useUpdateQuestionMutation } from '../../features/api/questionSlice';
import { useDeleteQuestionMutation } from '../../features/api/questionSlice';
import { useAddAnswerMutation } from '../../features/api/answerSlice';
import { useAddCommentMutation } from '../../features/api/commentSlice';
import { useGetQuestionQuery } from '../../features/api/questionSlice';
import { voteApi } from '../../features/api/voteSlice';
import Answer from './Answer';
import Comment from '../../Components/Comment';
import TextArea from '../../Components/TextArea';
import VoteElement from './VoteElement';
import { loadingElm, displayElement } from '../../ui/UIutils';

function Question() {
    const navigate = useNavigate();
    const [editQuestionState, setEditQuestionState] = useState(false);
    const [contentToSend, setContentToSend] = useState();
    const [idEditor, setIdEditor] = useState();

    const user = useSelector(state => state.user);
    const { id } = useParams();

    const {data, error, isLoading, refetch} = useGetQuestionQuery(id);
    const [trigger] = voteApi.useLazyGetVotesQuery();
    const [updateQuestion] = useUpdateQuestionMutation();
    const [deleteQuestion] = useDeleteQuestionMutation();
    const [addAnswer] = useAddAnswerMutation();
    const [addComment] = useAddCommentMutation();

    

    useEffect(() => {
        if (user.token) {
            trigger({url: `?question=${id}`, token: user.token});
        }
    }, [user]);

    useEffect(() => {
        if (data && idEditor){
            let targetElement = null;
            targetElement = document.getElementById(idEditor);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }
        }
    }, [idEditor]);


    function displayTextEditor (type, id) {
        if (idEditor === type + id){
            setIdEditor("");
        }
        else {
            setIdEditor(type + id);
        }
    }

    function editQuestion () {
        const title = document.getElementById('titleQuestion').value;
        const content = contentToSend;
        const body = {
            title : title,
            content : content,
        }
        const token = user.token;
        const bodyJson = JSON.stringify(body);
        updateQuestion({ id: id, token: token, body: bodyJson});
        setEditQuestionState(false);
    }

    const addAnswerData = async () => {
        const body = {
            content: contentToSend,
            user: `/api/users/${user.user.id}`,
            question: `/api/questions/${data.id}`,
        }
        const token = user.token;
        const bodyJson = JSON.stringify(body);
        const resultAnswer = await addAnswer({body: bodyJson, token: token});
        if (resultAnswer.data) {
            setIdEditor(`answerElm${resultAnswer.data.id}`);
            refetch(id);
        }
    }

    const addCommentData = async () => {
        const body = {
            content: contentToSend,
            user: `/api/users/${user.user.id}`,
            question: `/api/questions/${data.id}`,
        }
        const token = user.token;
        const bodyJson = JSON.stringify(body);
        const resultComment = await addComment({body: bodyJson, token: token});
        if (resultComment.data) {
            setIdEditor(`commentElm${resultComment.data.id}`);
            refetch(id);
        }
    }

    

    if (error) {
        return (
            <div className='d-flex align-items-center justify-content-center h-100'>
                <p className='text-danger display-6'>
                    La question n'a pas pu être chargée
                </p>
            </div>
        )
    }
    return (
        <div className="d-flex flex-column pt-2 questionDetail">
            <span className="separator w-100"></span>
            <div className="d-flex justify-content-between align-items-start pt-2">
                { isLoading ? 
                    loadingElm()               
                    :
                    <div className='d-flex align-items-center'>
                    <Link to={`/profils/${data.user.id}`} className="d-flex  linkToProfil" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                        <img src={ process.env.REACT_APP_URL_IMG + data.user.avatar} className='avatar' alt="avatar" height="50px" width="50px" />
                        <div className="ps-3 pe-3">
                            <h4>
                                { data.user.username }
                            </h4>
                            <h6>
                                lvl {getLvl( data.user.popularity )}
                            </h6>
                        </div>
                    </Link>
                    {(data.user.id === user.user.id) &&
                    <div>
                        <button className='buttonStyle ms-5' onClick={() => setEditQuestionState(!editQuestionState)}>
                           {editQuestionState ? "Annuler" : 'Editer la question'} 
                        </button>
                        <button className='buttonStyle ms-5 ms-3 bg-danger' onClick={() => {deleteQuestion({id: id, token: user.token}); navigate('/'); }}>
                            Effacer la question
                        </button>
                    </div>
                    }
                    </div>
                }
                <div className="d-flex flex-column align-items-end justify-content-end">
                    <ul className="d-flex listTagsElmPreview">
                        {isLoading ? 
                            loadingElm()
                            :
                            data.tags.map( tag => 
                                <li className="ms-3" key={tag.id + tag.category.name}>
                                    {tag.category.name}
                                </li>
                            )
                        }
                    </ul>
                        {isLoading ? 
                            loadingElm()
                            :
                            <p className="text-end mt-2 timePreview">
                                {getDateDetail(data.createdAt)}
                            </p>
                        }
                </div>
            </div>
            <div>
                <h3 className="titleQuestion offset-1">
                    {isLoading ? 
                        loadingElm()
                        :
                        editQuestionState ?
                        <input type='text' defaultValue={data.title} id='titleQuestion'/>
                        :
                        data.title
                    }
                </h3>
            </div>
            <span className="separator w-100"></span>
            <div className="d-flex w-100">
                {isLoading ? 
                    loadingElm()
                    :
                    < VoteElement refetch={refetch} class1={"question"} class2={"mt-3 mb-3"}  idAuthor={data.user.id} popularity={data.popularity} typeParent={"question"} idParentElm={data.id} idElm={`/api/questions/${data.id}`} />
                }
                <div className='d-flex align-items-start w-100'>
                    {isLoading ? 
                        loadingElm()
                        :
                        editQuestionState ?
                        < TextArea id = {"question"} content={data.content} setContent={setContentToSend}/>
                        :
                        <div dangerouslySetInnerHTML={{ __html: data.content }} className='mt-3' />
                    }
                </div>
            </div>
            {editQuestionState && 
            <button className='buttonStyle mb-3 mt-5' onClick={() => editQuestion()}>Soumettre</button>}
            <div className="d-flex offset-1 justify-content-between pb-3">
                <div>
                    {isLoading ? 
                        <button className="me-5 buttonAnswer" >
                            <img src={ process.env.REACT_APP_URL_IMG + "answerIcon.png"} alt="répondre" height="20px" className="me-2"/>
                            Répondre
                        </button>
                        :
                        user.user.id ?
                            data.user.id !== user.user.id ?
                                <button className="me-5 buttonAnswer"  onClick={event => displayTextEditor("answer", data.id)} >
                                    <img src={ process.env.REACT_APP_URL_IMG + "answerIcon.png"} alt="répondre" height="20px" className="me-2"/>
                                    Répondre
                                </button>
                                : null
                            : 
                            <button className="me-5 buttonAnswer"  data-bs-toggle="modal" data-bs-target="#loginModal" >
                                <img src={ process.env.REACT_APP_URL_IMG + "answerIcon.png"} alt="répondre" height="20px" className="me-2"/>
                                Répondre
                            </button>
                    }
                    {isLoading ? 
                        <button  className="me-5 buttonComment">
                            <img src={ process.env.REACT_APP_URL_IMG + "commentIcon.png"} alt="répondre" height="20px" className="me-2"/>
                            Commenter
                        </button>
                        :
                        user.user.id ?
                            <button  className="me-5 buttonComment"  onClick={event => displayTextEditor("comment", data.id)}>
                                <img src={ process.env.REACT_APP_URL_IMG + "commentIcon.png"} alt="répondre" height="20px" className="me-2"/>
                                Commenter
                            </button>
                            :
                            <button  className="me-5 buttonComment" data-bs-toggle="modal" data-bs-target="#loginModal" >
                                <img src={ process.env.REACT_APP_URL_IMG + "commentIcon.png"} alt="répondre" height="20px" className="me-2"/>
                                Commenter
                            </button>
                    }
                </div>
                <div className="d-flex align-items-center buttonListComments" onClick={event => displayElement(event, "questionDetail", "listComments")}>
                    {isLoading ? 
                        loadingElm()
                        :
                        <p className="me-2 mb-0 fw-bolder">
                            Voir commentaires ({data.comments.length})
                        </p>
                    }
                    <i className="fa-solid fa-angle-up"></i>
                </div>
            </div>
            <span className="separator w-100"></span>
            {isLoading ? 
                null
                :
                idEditor === `answer${data.id}` && 
                    <div className='d-flex flex-column align-items-center'>
                        < TextArea id={"answer"}  setContent={setContentToSend} class={'answer'}/>
                        <button className='buttonStyle' onClick={() => addAnswerData()}>Envoyer la réponse</button>
                    </div>
                
            }
            <ul className='listComments'>
                {isLoading ? 
                    loadingElm()
                    :
                    data.comments.map(comment => 
                        <li key={comment.id + comment.user.username} className='active' id={`commentElm${comment.id}`}>
                            < Comment comment={comment} idQuestion={data.id} idAnswer={null} refetch={refetch}/>
                        </li>
                    )
                }
            </ul>
            {isLoading ? 
                null
                :
                idEditor === `comment${data.id}` && 
                <div className='d-flex flex-column align-items-center'>
                    < TextArea id={`comment${data.id}`}  setContent={setContentToSend} class={'comment'}/>
                    <button className="buttonStyle" onClick={() => addCommentData()}>Envoyer</button>
                </div>
            }
            <div>
                
                    {isLoading ? 
                        loadingElm()
                        :
                        <p className=' fw-bolder mt-2'>
                            {data.answers.length + " réponse" + data.answers.length > 1 ? "s" : null}
                        </p>
                    }
            </div>
            <div>
                {isLoading ? 
                    loadingElm()
                    :
                    <>
                    {data.answers.map( answer => answer.status === "Validated" &&
                        < Answer question={data}  key= {answer.id + answer.status} answer={answer} idQuestion={data.id} refetch={refetch} displayTextEditor={displayTextEditor} idEditor={idEditor} isLoading={isLoading}/>
                       )}
                    {
                       data.answers.map( answer => answer.status !== "Validated" &&
                     < Answer question={data}  key= {answer.id + answer.status} answer={answer} idQuestion={data.id} refetch={refetch} displayTextEditor={displayTextEditor} idEditor={idEditor} isLoading={isLoading}/>
                    ) 
                    }
                    </>
                }
            </div>
        </div>
    )
}

export default Question;