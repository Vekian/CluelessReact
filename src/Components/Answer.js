import { getDateDetail, getLvl, displayElement } from '../api/APIutils' ;
import Comment from './Comment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadOriginAnswer, emptyOrigin } from '../features/question/questionSlice';
import TextArea from './TextArea';

function Answer(props) {
    const dispatch = useDispatch();
    const editorAnswer = useSelector(state => state.question.originAnswer.answer);

    useEffect(() => {
        let targetElement = null;
        if (editorAnswer === props.answer.id){
            targetElement = document.getElementById("answer" + props.answer.id);
        }

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }, [editorAnswer]);

    function displayTextEditor (type, id) {
        dispatch(emptyOrigin());
        let payload = {
            type: type,
            origin: id
        };
        dispatch(loadOriginAnswer(payload));
    }

    return (
        <div className='answerDetail'>
            <div className={props.answer.status === "Accepted" ? "d-flex flex-column col-10  p-2 colorAnswerContainer mb-2" : "d-flex flex-column col-10 answerContainer p-2 mb-2"} >
                <div className="d-flex justify-content-between pb-2 align-items-end">
                    <div className="d-flex align-items-end">
                        <img src={ process.env.REACT_APP_URL + props.answer.user.avatar} alt="avatar" height="25px" width="25px" />
                        <h6 className="ms-2 mb-0">
                            {props.answer.user.username}
                        </h6>
                        <p className="ms-4 mb-0">
                            lvl {getLvl(props.answer.user.popularity)}
                        </p>
                        {props.answer.status === "Pending" ? 
                        <span className='d-flex align-items-end'>
                            <img src={process.env.REACT_APP_URL + "assets/images/valide.png"} alt="validée" height="25px" width="25px" className="ms-4" />
                            <span className="ms-2">Validée par l'auteur</span>
                        </span>
                        : null
                        }
                    </div>
                    <div>
                        { getDateDetail(props.answer.createdAt)}
                    </div>
                </div>
                <span className="separator w-100"></span>
                <div className="d-flex">
                    <div className="col-1 d-flex flex-column justify-content-center align-items-center answerVote mt-2 mb-2">
                        <i className="fa-solid fa-circle-up"></i>
                            <h5 className="mb-2 mt-2">{props.answer.popularity}</h5>
                        <i className="fa-solid fa-circle-down"></i>
                    </div>
                    <div className='pt-2 d-flex flex-column justify-content-between w-100'>
                        <div dangerouslySetInnerHTML={{ __html: props.answer.content }} />
                        <div className='d-flex justify-content-between'>
                            <button className="me-5 buttonComment" onClick={event => displayTextEditor("answer", "answer" + props.answer.id)}>
                                <img src={ process.env.REACT_APP_URL + "assets/images/commentIcon.png"} alt="répondre" height="20px" className="me-2" />
                                Commenter
                            </button> 
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
                        < Comment comment={comment}/>
                    </li>
                    )}
            </ul>
            {editorAnswer === "answer" + props.answer.id && < TextArea id = {"answer" + props.answer.id} />   }
        </div>
    )
}

export default Answer;