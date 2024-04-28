import '../Home.css';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ElmPreview from './ElmPreview';
import { useGetQuestionsQuery } from '../../../features/api/questionSlice';
import { UIContext } from '../../../Components/UIProvider';
import { activeElm } from '../../../ui/UIutils';
import Paginator from './Paginator';
import { Comment } from 'react-loader-spinner';

function Questions() {
    const {filterQuestion, changeFilterQuestion} = useContext(UIContext);
    const {currentData, error, isFetching, isSuccess} =  useGetQuestionsQuery({ page: filterQuestion[0], filter: filterQuestion[1]});


    return (
        <div className="elms d-flex flex-column pe-3">
            <div className='mb-2'>
                <ul className="d-flex align-items-center elmsList mb-2">
                    <h4>
                        Questions
                    </h4>
                    <li className="ms-4 active" onClick={(event) => {
                            activeElm(event, "elmsList");
                            changeFilterQuestion(['?page=1', '']);
                            
                        }}>
                        Toutes
                    </li>
                    <li className="ms-4" onClick={(event) => {
                            activeElm(event, "elmsList");
                            changeFilterQuestion(['&page=1','?order[popularity]=desc']);
                        }}>
                        Populaires
                    </li>
                    <li className="ms-4" onClick={(event) => {
                            activeElm(event, "elmsList");
                            changeFilterQuestion(['&page=1', '?order[createdAt]=desc']);
                            
                        }}>
                        Récentes
                    </li>
                </ul>
            </div>
            <div className='ps-2 listOfElms'>
                {isFetching ? 
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <Comment
                            visible={true}
                            height="120"
                            width="120"
                            ariaLabel="comment-loading"
                            wrapperStyle={{}}
                            wrapperClass="comment-wrapper"
                            color="#fff"
                            backgroundColor="var(--primaryColor)"
                        />
                    </div>
                    : 
                    error ?
                        <div>
                            Problème de chargement des questions
                        </div> 
                        :
                        currentData && currentData['hydra:member'].map(question => 
                            <Link to={`/question/${question.id}`} style={{ color: 'inherit', textDecoration: 'inherit'}}  key={question.id + "question"}>
                                < ElmPreview elm={question} type={"question"}/>
                            </Link>
                        )
                }
            </div>
            {
                currentData ?  < Paginator pagination={currentData['hydra:view']} isSuccess={isSuccess} changeFilter= {changeFilterQuestion} filter={filterQuestion}/>
                :
                <ul className='d-flex listPages mt-1 ms-2'>
                    <li className='pageItem active'>
                        1
                    </li>
                    <li className='pageItem'>
                        2
                    </li>
                    <li className='pageItem'>
                        3
                    </li>
                </ul>
            }
        </div>
    )
}

export default Questions;