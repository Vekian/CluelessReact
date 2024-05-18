import './Question.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDateDetail, getLvl} from '../../api/APIutils' ;
import { useDeleteQuestionMutation } from '../../features/api/questionSlice';
import { useAddCommentMutation } from '../../features/api/commentSlice';
import { useGetQuestionQuery } from '../../features/api/questionSlice';
import { voteApi } from '../../features/api/voteSlice';
import Answer from './Answer';
import Comment from '../Comment';
import TextArea from '../WriteNew/TextArea';
import VoteElement from './VoteElement';
import { loadingElm, displayElement } from '../../ui/UIutils';
import EditQuestion from './Edit/EditQuestion';
import AddAnswer from './Add/AddAnswer';

export default function Question() {
    const navigate = useNavigate();
    const [editQuestionState, setEditQuestionState] = useState(false);
    const [contentToSend, setContentToSend] = useState();
    const [idEditor, setIdEditor] = useState();

    const user = useSelector(state => state.user);
    const { id } = useParams();

    const {data, error, isLoading, refetch} = useGetQuestionQuery(id);
    const [trigger] = voteApi.useLazyGetVotesQuery();
    const [deleteQuestion] = useDeleteQuestionMutation();
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
        <div className="d-flex flex-column ps-1 pe-2 pt-2 questionDetail">
            <span className="separator w-100"></span>
            <div className="d-flex flex-wrap justify-content-between align-items-start pt-2">
                
                { isLoading ? 
                    loadingElm()               
                    :
                    <>
                        <Link to={`/profils/${data.user.id}`} className="d-flex col-lg-2 linkToProfil" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            <img src={ process.env.REACT_APP_URL_IMG + data.user.avatar} className='avatar' alt="avatar" height="75px" width="75px" />
                            <div className="ps-3 pe-3">
                                <h4>
                                    { data.user.username }
                                </h4>
                                <h6>
                                    lvl {getLvl( data.user.popularity )}
                                </h6>
                            </div>
                        </Link>
                        <div className='d-flex col-lg-6 align-items-center'>
                            {(data.user.id === user.user.id) &&
                            <div>
                                <button className='buttonStyle ms-lg-5 ms-1' onClick={() => setEditQuestionState(!editQuestionState)}>
                                {editQuestionState ? "Annuler" : 'Editer'} 
                                </button>
                                <button className='buttonStyle  ms-3 bg-danger' onClick={() => {deleteQuestion({id: id, token: user.token}); navigate('/'); }}>
                                    Supprimer
                                </button>
                            </div>
                            }
                        </div>
                    </>
                }
                <div className="d-flex flex-lg-column col-lg-3 col-12 flex-row-reverse align-items-lg-end align-items-start justify-content-between justify-content-lg-end">
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
            {
                editQuestionState ?
                < EditQuestion user={user} data={data} refetch={refetch} isLoading={isLoading} setEditQuestionState={setEditQuestionState} />
                :
                <>
                    <div>
                        <h3 className="titleQuestion offset-1">
                            {isLoading ? 
                                loadingElm()
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
                                <div dangerouslySetInnerHTML={{ __html: data.content }} className='mt-3' />
                            }
                        </div>
                    </div>
                </>
            }
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
                < AddAnswer user={user} data={data} setIdEditor={setIdEditor} refetch={refetch} />
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
                    < TextArea id={`comment${data.id}`} content={contentToSend}  setContent={setContentToSend} class={'comment'}/>
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