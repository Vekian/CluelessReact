import './Comment.css';
import { getDateDetail, getLvl } from '../api/APIutils' ;
import VoteElement from './Question/VoteElement';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { useUpdateCommentMutation } from '../features/api/commentSlice';
import { useDeleteCommentMutation } from '../features/api/commentSlice';
import TextArea from './WriteNew/TextArea';

export default function Comment(props) {
    const user = useSelector(state => state.user);
    const [editCommentState, setEditCommentState] = useState(false);
    const [contentToSend, setContentToSend] = useState();
    const [editComment] = useUpdateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();

    const editCommentData = async () => {
        const content = contentToSend;
        const body = {
            content: content
        }
        const bodyJson = JSON.stringify(body);
        const token = user.token;
        const resultAnswer = await editComment({id: props.comment.id, token: token, body: bodyJson});
        if (resultAnswer.data) {
            setEditCommentState(false);
            props.refetch(props.idQuestion);
        }
    }

    const deleteCommentData = async () => {
        const resultDelete = await deleteComment({id: props.comment.id, token: user.token}); 
        if (resultDelete){
            props.refetch(props.idQuestion);
            setContentToSend('y');
        }
    }

    return (
        <div className='d-flex flex-column offset-1 mt-2 mb-2 border border-top-0 border-start-0 '>
            <div className="d-flex p-2">
                <div className="d-flex flex-column w-100">
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-2 me-3">
                        <div className='d-flex flex-wrap'>
                            <Link to={`/profils/${props.comment.user.id}`} className="d-flex align-items-end linkToProfil" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                <img src={ process.env.REACT_APP_URL_IMG + props.comment.user.avatar} className='avatar' alt="avatar" height="35px" width="35px" />
                                <h5 className='ms-2 me-2'>
                                    {props.comment.user.username}
                                </h5>
                                <span>
                                    lvl { getLvl(props.comment.user.popularity)}
                                </span>
                            </Link>
                            {user.user.id === props.comment.user.id && 
                            <div>
                                <button className='buttonStyle-xs ms-lg-3 ms-1' onClick={() => setEditCommentState(!editCommentState)}>Editer</button>
                                <button className='buttonStyle-xs bg-danger ms-lg-4 ms-2' onClick={() => { deleteCommentData()}}>Supprimer</button>
                            </div>
                            }
                        </div>
                        <div className='d-flex align-items-center mt-1'>
                            <div className=' timePreview'>
                                {getDateDetail(props.comment.createdAt)}
                            </div>
                        </div>
                    </div>
                    { editCommentState ? 
                        <div className='d-flex flex-column align-items-center'>
                            <TextArea id={'comment'} content={props.comment.content} setContent={setContentToSend}/>
                            <button className='buttonStyle' onClick={() => editCommentData()}>Modifier</button>
                        </div>
                        :
                        <div dangerouslySetInnerHTML={{ __html: props.comment.content }} />
                    }
                </div>
                < VoteElement refetch={props.refetch} class1={"comment"} class2={"mt-1 mb-1"} popularity={props.comment.popularity} idAuthor={props.comment.user.id} idComment={props.comment.id} idAnswer={props.idAnswer} typeParent={props.idQuestion ? "question" : "clue"} idParentElm={props.idQuestion ? props.idQuestion : props.idClue} idElm={`/api/comments/${props.comment.id}`}/>
            </div>
        </div>
        
    )
}