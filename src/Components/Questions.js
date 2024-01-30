import { useDispatch, useSelector } from 'react-redux';
import {  fetchData } from '../api/APIutils';
import { Link } from 'react-router-dom';
import { loadQuestions, emptyQuestions} from '../features/question/questionSlice';
import QuestionPreview from './QuestionPreview';

function Questions() {
    const dispatch = useDispatch();
    const questions = useSelector(state => state.question.questions);
    
    function loadData(data){
        dispatch(emptyQuestions());
        for (let question of data["hydra:member"]){
            dispatch(loadQuestions(question));
        } 
    }

    function activeElm(event, parentElmClass) {
        let parentElm = document.querySelector('.' + parentElmClass);
        let elmList = parentElm.querySelectorAll('li');
        for (let listElement of elmList) {
            listElement.classList.remove("active");
        }

        const clickedElement = event.currentTarget;
        clickedElement.classList.toggle("active");
    }

    return (
        <div className="questions d-flex flex-column pe-3">
            <div>
                <ul className="d-flex align-items-center questionsList mb-2">
                    <h4>
                        Questions
                    </h4>
                    <li className="ms-4 active" onClick={(event) => {
                            fetchData('questions?page=1', 'GET' , loadData);
                            activeElm(event, "questionsList")
                        }}>
                        Toutes
                    </li>
                    <li className="ms-4" onClick={(event) => {
                            activeElm(event, "questionsList");
                            fetchData('questions?page=1&order[popularity]=desc', 'GET', loadData);
                        }}>
                        Populaires
                    </li>
                    <li className="ms-4" onClick={(event) => {
                            activeElm(event, "questionsList");
                            fetchData('questions?page=1&order[createdAt]=desc', 'GET', loadData);
                        }}>
                        Récentes
                    </li>
                </ul>
            </div>
            <div>
                { questions.map(question => 
                    <Link to={`/question/${question.id}`} style={{ color: 'inherit', textDecoration: 'inherit'}}  key={question.id}>
                        < QuestionPreview question={question}/>
                    </Link>
                )}
                
            </div>
        </div>
    )
}

export default Questions;