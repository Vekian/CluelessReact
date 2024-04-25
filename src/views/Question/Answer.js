import { getDateDetail, getLvl } from '../../api/APIutils' ;
import { displayElement } from '../../ui/UIutils';
import { useSelector } from 'react-redux';
import Comment from '../../Components/Comment';
import TextArea from '../../Components/TextArea';
import VoteElement from './VoteElement';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDeleteAnswerMutation, useUpdateAnswerMutation } from '../../features/api/answerSlice';
import { useAddCommentMutation } from '../../features/api/commentSlice';

function Answer(props) {
    const user = useSelector(state => state.user);
    const [editAnswerState, setEditAnswerState] = useState(false);
    const [contentToSend, setContentToSend] = useState();
    const [editAnswer] = useUpdateAnswerMutation();
    const [deleteAnswer] = useDeleteAnswerMutation();
    const [addComment] = useAddCommentMutation();

   useEffect(() => {
    if (props.idEditor === `answerElm${props.answer.id}`){
         document.getElementById(props.idEditor).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
   }, [props.idEditor])

   const editAnswerData = async () => {
        const content = contentToSend;
        const body = {
            content: content
        }
        const bodyJson = JSON.stringify(body);
        const token = user.token;
        const resultAnswer = await editAnswer({id: props.answer.id, token: token, body: bodyJson});
        if (resultAnswer.data) {
            setEditAnswerState(false);
            props.refetch(props.idQuestion);
        }
   }

   const deleteAnswerData = async () => {
        const resultDelete = await deleteAnswer({id: props.answer.id, token: user.token}); 
        if (resultDelete){
            props.refetch(props.idQuestion);
            setContentToSend('y');
        }
   }

    const addCommentData = async () => {
        const body = {
            content: contentToSend,
            user: `/api/users/${user.user.id}`,
            answer: `/api/answers/${props.answer.id}`,
        }
        const token = user.token;
        const bodyJson = JSON.stringify(body);
        const resultComment = await addComment({body: bodyJson, token: token});
        if (resultComment.data) {
            props.refetch(props.idQuestion);
            props.displayTextEditor("0", "0");
        }
    }
    return (
        <div className='answerDetail' id={`answerElm${props.answer.id}`}>
            <div className={props.answer.status === "Accepted" ? "d-flex flex-column col-10  p-2 colorAnswerContainer mb-2" : "d-flex flex-column col-10 answerContainer p-2 mb-2"} >
                <div className="d-flex justify-content-between pb-2 align-items-end">
                    <div className='d-flex'>
                    <Link to={`/profils/${props.answer.user.id}`} className="d-flex align-items-end linkToProfil" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                        <img src={ process.env.REACT_APP_URL + props.answer.user.avatar} className='avatar' alt="avatar" height="25px" width="25px" />
                        <h6 className="ms-2 mb-0">
                            {props.answer.user.username}
                        </h6>
                        <p className="ms-4 mb-0">
                            lvl {getLvl(props.answer.user.popularity)}
                        </p>
                    </Link>
                    {props.answer.status === "Pending" ? 
                        <span className='d-flex align-items-end'>
                            <img src={process.env.REACT_APP_URL + "valide.png"} alt="validée" height="25px" width="25px" className="ms-4" />
                            <span className="ms-2">Validée par l'auteur</span>
                        </span>
                        : null
                    }
                    { user.user.id === props.answer.user.id && <button className='buttonStyle ms-4' onClick={() => setEditAnswerState(!editAnswerState)}>Editer la réponse</button>}
                    { user.user.id === props.answer.user.id && <button className='buttonStyle ms-4 bg-danger' onClick={() => {deleteAnswerData({id: props.answer.id, token: user.token}); props.refetch(props.idQuestion); }}>Effacer la réponse</button>}
                    </div>
                    <div>
                        { getDateDetail(props.answer.createdAt)}
                    </div>
                </div>
                <span className="separator w-100"></span>
                <div className="d-flex">
                    < VoteElement refetch={props.refetch} class1={"answer"} class2={"mt-2 mb-2"} typeParent={"question"} popularity={props.answer.popularity} idAuthor={props.answer.user.id} idAnswer={props.answer.id} idParentElm={props.idQuestion} idElm={`/api/answers/${props.answer.id}`}/>
                    <div className='pt-2 d-flex flex-column justify-content-between w-100'>
                        {editAnswerState ?
                        <div className='d-flex flex-column align-items-center'>
                            <TextArea id={'answer'} content={props.answer.content} setContent={setContentToSend}/>
                            <button className='buttonStyle mb-3' onClick={() => editAnswerData()}>Modifier</button>
                        </div>
                            :
                            <div dangerouslySetInnerHTML={{ __html: props.answer.content }} />
                        }
                        
                        <div className='d-flex justify-content-between mt-2'>
                            {props.isLoading ? 
                                <button className="me-5 buttonComment" >
                                    <img src={ process.env.REACT_APP_URL + "commentIcon.png"} alt="répondre" height="20px" className="me-2" />
                                    Commenter
                                </button> 
                                :
                                user.user.id ?
                                    <button className="me-5 buttonComment" onClick={event => props.displayTextEditor(`answerComment`, props.answer.id)}>
                                        <img src={ process.env.REACT_APP_URL + "commentIcon.png"} alt="répondre" height="20px" className="me-2" />
                                        Commenter
                                    </button> 
                                    :
                                    <button className="me-5 buttonComment" data-bs-toggle="modal" data-bs-target="#loginModal">
                                        <img src={ process.env.REACT_APP_URL + "commentIcon.png"} alt="répondre" height="20px" className="me-2" />
                                        Commenter
                                    </button> 
                            }
                            
                            {props.answer.comments.length > 0 ? 
                                <div className='d-flex align-items-center me-2  buttonListComments' onClick={event => displayElement(event, "answerDetail", "listComments")}>
                                    <p className="me-2 mb-0 fw-bolder">
                                        Voir commentaire{props.answer.comments.length > 1 ? "s" : null} ({props.answer.comments.length})
                                    </p>
                                    <i className="fa-solid fa-angle-up"></i>
                                </div> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ul className='listComments'>
                {props.answer.comments.map(comment => 
                    <li key={comment.id + comment.user.username} className='active'>
                        < Comment comment={comment} idQuestion={props.idQuestion}  idAnswer={props.answer.id} refetch={props.refetch}/>
                    </li>
                    )}
            </ul>
            {props.idEditor === `answerComment${props.answer.id}` && 
            <div className='d-flex flex-column align-items-center mb-3'>
                < TextArea id={"answer" + props.answer.id} content={contentToSend} setContent={setContentToSend} class={'comment'}/>
                <button className='buttonStyle' onClick={() => addCommentData()}>Envoyer</button>
            </div>   }
        </div>
    )
}

export default Answer;