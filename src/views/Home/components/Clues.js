import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CluePreview from './CluePreview';
import { useGetCluesQuery } from '../../../features/api/clueSlice';
import { UIContext } from '../../../Components/UIProvider';
import { activeElm } from '../../../ui/UIutils';
import Paginator from './Paginator';
import { Comment } from 'react-loader-spinner';

function Clues() {
    const {filterClue, changeFilterClue} = useContext(UIContext);
    const {currentData, error, isFetching, isSuccess} = useGetCluesQuery({ page: filterClue[0], filter: filterClue[1]});

    return(
        <div className=" d-flex flex-column pe-3">
            <div className='mb-2'>
                <ul className="d-flex align-items-center cluesList mb-2 ps-xxl-1 ps-0">
                    <h4>
                        Astuces
                    </h4>
                    <li className="ms-xxl-3 ms-3 active" onClick={(event) => {
                            activeElm(event, "cluesList");
                            changeFilterClue(['?page=1', '']);
                        }}>
                        Toutes
                    </li>
                    <li className="ms-xxl-2 ms-1" onClick={(event) => {
                            activeElm(event, "cluesList");
                            changeFilterClue(['&page=1','?order[popularity]=desc']);
                        }}>
                        Populaires
                    </li>
                    <li className="ms-xxl-2 ms-1" onClick={(event) => {
                            activeElm(event, "cluesList");
                            changeFilterClue(['&page=1', '?order[createdAt]=desc']);
                        }}>
                        Récentes
                    </li>
                </ul>
            </div>
            <div className='listOfElms '>
                { isFetching ?
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
                        currentData['hydra:member'].map(clue => 
                        <Link to={`/clue/${clue.id}`} style={{ color: 'inherit', textDecoration: 'inherit'}}  key={clue.id + "clue"}>
                            < CluePreview elm={clue} type={"clue"}/>
                        </Link>
                )}
            </div>
            {
                currentData ?  < Paginator pagination={currentData['hydra:view']} isSuccess={isSuccess} changeFilter= {changeFilterClue} classParent={''} filter={filterClue} />
                :
                <ul className='d-flex listPages mt-1'>
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
export default Clues;