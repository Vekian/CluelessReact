import { getDateDetail, getLvl } from '../../api/APIutils' ;
import { displayElement } from '../../ui/UIutils';
import { useSelector } from 'react-redux';
import Comment from '../Comment';
import VoteElement from './VoteElement';
import { Link } from 'react-router-dom';
import AddComment from './Add/AddComment';
import React, { useEffect, useState } from 'react';
import { useValidateAnswerMutation } from '../../features/api/answerSlice';
import EditAnswer from './Edit/EditAnswer';
import DeleteAnswer from './Delete/DeleteAnswer';

export default function Answer(props) {
    const user = useSelector(state => state.user);
    const [editAnswerState, setEditAnswerState] = useState(false);
    const [validateAnswer] = useValidateAnswerMutation();

   useEffect(() => {
    if (props.idEditor === `answerElm${props.answer.id}`){
         document.getElementById(props.idEditor).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
   }, [props.idEditor])

   const validateAnswerData = async() => {
        const body = {
            status: "Validated",
        };
        const bodyJson = JSON.stringify(body);
        const resultValidate = await validateAnswer({id: props.answer.id, token: user.token, body: bodyJson});
        if (resultValidate.data){
            props.refetch(props.idQuestion);
            props.displayTextEditor("0", "0");
        }
   }

    function checkScoreBeValid() {
        const question = props.question;
        if (question) {
            if (user.user.id !== question.user.id  || props.answer.status === "Validated") {
                
                return false;
            }
            else {
                const answers = question.answers;
                let alreadyAnswered = false;
                for (let answer of answers) {
                    if (answer.status === "Validated") {
                        alreadyAnswered = true;
                        break;
                    }
                }
                if (alreadyAnswered){
                    return false;
                }
            }
        }
        return true;
    }
 
    return (
        <div className='answerDetail' id={`answerElm${props.answer.id}`}>
            <div className={props.answer.status === "Accepted" ? "d-flex flex-column col-sm-10 col-11  p-2 colorAnswerContainer mb-2" : "d-flex flex-column col-sm-10 col-11 answerContainer p-2 mb-2"} >
                <div className="d-flex flex-wrap justify-content-between pb-2 align-items-end">
                    <div className='d-flex flex-wrap'>
                        <Link to={`/profils/${props.answer.user.id}`} className="d-flex align-items-end linkToProfil" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            <img src={ process.env.REACT_APP_URL_IMG + props.answer.user.avatar} className='avatar' alt="avatar" height="50px" width="50px" />
                            <h5 className="ms-2 mb-0">
                                {props.answer.user.username}
                            </h5>
                            <p className="ms-4 mb-0">
                                lvl {getLvl(props.answer.user.popularity)}
                            </p>
                        </Link>
                        {props.answer.status === "Validated" ? 
                            <span className='d-flex align-items-end'>
                                <img src={process.env.REACT_APP_URL_IMG + "Checkmark.svg.png"} alt="validée" height="25px" width="25px" className="ms-4" />
                                <span className="ms-2">Validée par l'auteur</span>
                            </span>
                            : null
                        }
                        <div className='d-flex align-items-center'>
                            { user.user.id === props.answer.user.id && <button className='buttonStyle ms-lg-4 ms-1' onClick={() => setEditAnswerState(!editAnswerState)}>Editer</button>}
                            { user.user.id === props.answer.user.id && 
                                < DeleteAnswer user={user} answer={props.answer} idQuestion={props.question.id} refetch={props.refetch} />
                            }
                            { checkScoreBeValid() && <button className='buttonStyle ms-4 bg-success' onClick={() => {validateAnswerData() }}>Valider</button>}
                        </div>
                    </div>
                    <div className=' timePreview mt-1'>
                        { getDateDetail(props.answer.createdAt)}
                    </div>
                </div>
                <span className="separator w-100"></span>
                <div className="d-flex">
                    < VoteElement refetch={props.refetch} class1={"answer"} class2={"mt-2 mb-2 me-2"} typeParent={"question"} popularity={props.answer.popularity} idAuthor={props.answer.user.id} idAnswer={props.answer.id} idParentElm={props.idQuestion} idElm={`/api/answers/${props.answer.id}`}/>
                    <div className='pt-2 d-flex flex-column justify-content-between w-100'>
                        {editAnswerState ?
                            < EditAnswer user={user} data={props.answer} question={props.question} refetch={props.refetch} setEditAnswerState={setEditAnswerState}/>
                            :
                            <div dangerouslySetInnerHTML={{ __html: props.answer.content }} />
                        }
                        
                        <div className='d-flex flex-wrap justify-content-between mt-2'>
                            {props.isLoading ? 
                                <button className="me-lg-5 me-1 buttonComment" >
                                    <img src={ process.env.REACT_APP_URL_IMG + "commentIcon.png"} alt="répondre" height="20px" className="me-2" />
                                    Commenter
                                </button> 
                                :
                                user.user.id ?
                                    <button className="me-lg-5 me-1 buttonComment" onClick={event => props.displayTextEditor(`answerComment`, props.answer.id)}>
                                        <img src={ process.env.REACT_APP_URL_IMG + "commentIcon.png"} alt="répondre" height="20px" className="me-2" />
                                        Commenter
                                    </button> 
                                    :
                                    <button className="me-lg-5 me-1 buttonComment" data-bs-toggle="modal" data-bs-target="#loginModal">
                                        <img src={ process.env.REACT_APP_URL_IMG + "commentIcon.png"} alt="répondre" height="20px" className="me-2" />
                                        Commenter
                                    </button> 
                            }
                            
                            {props.answer.comments.length > 0 ? 
                                <div className='d-flex align-items-center w-100 justify-content-end me-2 mt-md-0 mt-2 mb-2  buttonListComments' onClick={event => displayElement(event, "answerDetail", "listComments")}>
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
                < AddComment user={user} data={props.answer} setIdEditor={props.setIdEditor} refetch={props.refetch} author={"answer"} />
           }
        </div>
    )
}