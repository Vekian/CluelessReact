import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadQuestion, loadOriginAnswer, emptyOrigin } from '../features/question/questionSlice';
import { getDateDetail, getLvl, displayElement } from '../api/APIutils' ;
import Answer from './Answer';
import Comment from './Comment';
import TextArea from './TextArea';

function Question() {
    const dispatch = useDispatch();
    const question = useSelector(state => state.question.question);
    const editorQuestion = useSelector(state => state.question.originAnswer.question);
    const { id } = useParams();

    useEffect(() => {
        getQuestion(id);
        
    }, []);

    useEffect(() => {
        let targetElement = null;
        if (editorQuestion.answer === question.id){
            targetElement = document.getElementById("questionAnswer");
        }
        else if (editorQuestion.comment === question.id) {
            targetElement = document.getElementById("questionComment");
        }

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }, [editorQuestion]);

    function getQuestion(id){
        fetch('http://clueless.dvl.to/api/questions/' + id, 
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            dispatch(loadQuestion(data));
        })
    }

    function displayTextEditor (type, id) {
        dispatch(emptyOrigin());
        
        let payload = {
            type: type,
            origin: id
        };
        dispatch(loadOriginAnswer(payload));
    }

    

    return (
        question.user ? 
        <div className="d-flex flex-column pt-2 questionDetail">
            <span className="separator w-100"></span>
            <div className="d-flex justify-content-between align-items-start pt-2">
                <div className="d-flex">
                    <img src={ process.env.REACT_APP_URL + question.user.avatar} alt="avatar" height="50px" width="50px" />
                    <div className="ps-3">
                        <h4>
                            { question.user.username }
                        </h4>
                        <h6>
                            lvl {getLvl( question.user.popularity )}
                        </h6>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end justify-content-end">
                    <ul className="d-flex listTagsQuestionPreview">
                        {
                            question.tags.map( tag => 
                                <li className="ms-3" key={tag.id + tag.category.name}>
                                    {tag.category.name}
                                </li>
                            )
                        }
                    </ul>
                    <p className="text-end mb-1 pt-2">
                       { getDateDetail(question.createdAt)}
                    </p>
                </div>
            </div>
            <div>
                <h3 className="titleQuestion offset-1">
                    {question.title}
                </h3>
            </div>
            <span className="separator w-100"></span>
            <div className="d-flex">
                <div className="col-1 d-flex flex-column justify-content-center align-items-center questionVote mt-3 mb-3">
                    <i className="fa-solid fa-circle-up"></i>
                        <h5 className="mb-3 mt-3">{question.popularity}</h5>
                    <i className="fa-solid fa-circle-down"></i>
                </div>
                <div className='d-flex align-items-start'>
                    <p className="pt-3">
                        { question.content }
                    </p>
                </div>
            </div>
            <div className="d-flex offset-1 justify-content-between pb-3">
                <div>
                    <button className="me-5 buttonAnswer"  onClick={event => displayTextEditor("questionAnswer", question.id)} >
                        <img src={ process.env.REACT_APP_URL + "assets/images/answerIcon.png"} alt="répondre" height="20px" className="me-2"/>
                        Répondre
                    </button>
                    <button  className="me-5 buttonComment"  onClick={event => displayTextEditor("questionComment", question.id)}>
                    <img src={ process.env.REACT_APP_URL + "assets/images/commentIcon.png"} alt="répondre" height="20px" className="me-2"/>
                        Commenter
                    </button>
                </div>
                <div className="d-flex align-items-center buttonListComments" onClick={event => displayElement(event, "questionDetail", "listComments")}>
                    <p className="me-2 mb-0 fw-bolder">
                        Voir commentaires ({question.comments.length})
                    </p>
                    <i className="fa-solid fa-angle-up"></i>
                </div>
            </div>
            <span className="separator w-100"></span>
            {editorQuestion.answer === question.id && < TextArea id = {"questionAnswer"} idQuestion={question.id} /> }
            <ul className='listComments'>
                {question.comments.map(comment => 
                    <li key={comment.id + comment.user.username} className='active'>
                        < Comment comment={comment}/>
                    </li>
                    )}
            </ul>
            {editorQuestion.comment === question.id && < TextArea id={"questionComment"} /> }
            <div>
                <p className=' fw-bolder mt-2'>
                    {question.answers.length} réponse{question.answers.length > 1 ? "s" : null}
                </p>
            </div>
            <div>
                {question.answers.map( answer => 
                     < Answer  key= {answer.id + answer.status} answer={answer} />
                )}
            </div>
        </div> : null
    )
}

export default Question;