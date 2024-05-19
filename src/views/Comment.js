import './Comment.css';
import { getDateDetail, getLvl } from '../api/APIutils' ;
import VoteElement from './Question/VoteElement';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import EditComment from './Question/Edit/EditComment';
import DeleteComment from './Question/Delete/DeleteComment';

export default function Comment(props) {
    const user = useSelector(state => state.user);
    const [editCommentState, setEditCommentState] = useState(false);

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
                                < DeleteComment user={user} comment={props.comment} idQuestion={props.idQuestion} refetch={props.refetch} /> 
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
                        < EditComment user={user} data={props.comment} idQuestion={props.idQuestion ? props.idQuestion : props.idClue} refetch={props.refetch} setEditCommentState={setEditCommentState} />
                        :
                        <div dangerouslySetInnerHTML={{ __html: props.comment.content }} />
                    }
                </div>
                < VoteElement refetch={props.refetch} class1={"comment"} class2={"mt-1 mb-1"} popularity={props.comment.popularity} idAuthor={props.comment.user.id} idComment={props.comment.id} idAnswer={props.idAnswer} typeParent={props.idQuestion ? "question" : "clue"} idParentElm={props.idQuestion ? props.idQuestion : props.idClue} idElm={`/api/comments/${props.comment.id}`}/>
            </div>
        </div>
        
    )
}