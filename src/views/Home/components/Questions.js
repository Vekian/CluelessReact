import '../Home.css';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ElmPreview from './ElmPreview';
import { useGetQuestionsQuery } from '../../../features/api/questionSlice';
import { UIContext } from '../../../Components/UIProvider';
import Paginator from './Paginator';
import { Comment } from 'react-loader-spinner';

export default function Questions() {
    const {filterQuestion, changeFilterQuestion} = useContext(UIContext);
    const {currentData, error, isFetching, isSuccess} =  useGetQuestionsQuery({ page: filterQuestion[0], filter: filterQuestion[1]});


    return (
        <div className="elms d-flex flex-column pe-md-3">
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
                            backgroundColor="var(--tertiaryColor)"
                        />
                    </div>
                    : 
                    error ?
                        <div>
                            Problème de chargement des questions
                        </div> 
                        :
                        currentData && currentData['hydra:member'].length === 0 ?
                            <div className='d-flex align-items-center justify-content-center mt-5'>
                                <p>
                                    Aucune question ne correspond à vos critères de recherche
                                </p>
                            </div>
                            :
                            currentData['hydra:member'].map(question => 
                                <Link  to={`/question/${question.id}`} style={{ color: 'inherit', textDecoration: 'inherit'}}  key={question.id + "question"}>
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