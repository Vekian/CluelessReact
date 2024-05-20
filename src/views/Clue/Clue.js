import './Clue.css';
import { useParams, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDateDetail, getLvl, compareValiditySubscription } from '../../api/APIutils' ;
import Comment from '../Comment';
import AddComment from '../Question/Add/AddComment';
import VoteElement from '../Question/VoteElement';
import { useGetClueQuery } from '../../features/api/clueSlice';
import { loadingElm } from '../../ui/UIutils';
import { voteApi } from '../../features/api/voteSlice';
import EditClue from './Edit/EditClue';
import DeleteClue from './Delete/DeleteClue';

export default function Clue() {
    const [editClueState, setEditClueState] = useState(false);
    const user = useSelector(state => state.user);
    const [idEditor, setIdEditor] = useState();
    const { id } = useParams();

    const [trigger] = voteApi.useLazyGetVotesQuery();
    const { data, error, isLoading, refetch } = useGetClueQuery(id)
    

    useEffect(() => {
        if (user.token) {
            trigger({url: `?clue=${id}`, token: user.token});
        }
    }, [user]);

    useEffect(() => {
        if (idEditor){
            let targetElement = null;
            targetElement = document.getElementById(idEditor);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }
        }
    }, [idEditor]);

    function displayTextEditor (type, id) {
        if (idEditor === type + id){
            setIdEditor("");
        }
        else {
            setIdEditor(type + id);
        }
    }

    return (
        <div className="d-flex flex-column ps-2 pe-2 pt-2 clueDetail">
            <span className="separator w-100"></span>
            <div className="d-flex justify-content-between align-items-start pt-2">
                { isLoading ? 
                    loadingElm()
                    :
                    <>
                        <Link to={`/profils/${data.user.id}`} className="d-flex  linkToProfil" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            <img src={ process.env.REACT_APP_URL_IMG + data.user.avatar} className='avatar' alt="avatar" height="50px" width="50px" />
                            <div className="ps-3">
                                <h4 className={(data.user.subscriptions && compareValiditySubscription(data.user.subscriptions[0]?.expiredAt)) && "shiny-text"}>
                                    { data.user.username }
                                </h4>
                                <h6>
                                    lvl {getLvl( data.user.popularity )}
                                </h6>
                            </div>
                        </Link>
                        <div className='d-flex col-lg-6 align-items-center'>
                            {(data.user.id === user.user.id) &&
                            <div>
                                <button className='buttonStyle ms-lg-5 ms-1' onClick={() => setEditClueState(!editClueState)}>
                                {editClueState ? "Annuler" : 'Editer'} 
                                </button>
                                < DeleteClue data={data} user={user} />
                            </div>
                            }
                        </div>
                    </>
                }
                <div className="d-flex flex-column align-items-end justify-content-end">
                    <ul className="d-flex listTagsElmPreview">
                        {
                            isLoading ? 
                            loadingElm()
                            :
                            data.tags.map( tag => 
                                <li className="ms-3" key={tag.id + tag.category.name}>
                                    {tag.category.name}
                                </li>
                            )
                        }
                    </ul>
                    {
                        isLoading ?
                            loadingElm()
                            :
                            <p className="text-end mt-2 timePreview">
                            { getDateDetail(data.createdAt)}
                            </p>
                    }
                    
                </div>
            </div>
            {
                editClueState ?
                    < EditClue user={user} data={data} refetch={refetch} isLoading={isLoading} setEditClueState={setEditClueState}  />
                    :
                    <>
                        <div>
                            {isLoading ?
                                loadingElm()
                                :
                                <h3 className="titleClue offset-1">
                                    {data.title}
                                </h3>
                            }
                        </div>
                        <span className="separator w-100"></span>
                        <div className="d-flex">
                            { isLoading ? 
                                loadingElm()
                                :
                                <>
                                    < VoteElement refetch={refetch} class1={"clue"} class2={"mt-3 mb-3"} typeParent={"clue"} idAuthor={data.user.id} popularity={data.popularity} idParentElm={data.id} idElm={`/api/clues/${data.id}`} />
                                    <div className='d-flex align-items-start ps-3'>
                                        <div dangerouslySetInnerHTML={{ __html: data.content }} className='mt-3' />
                                    </div>
                                </>
                            }
                        </div>
                    </>
            }
            <div className="d-flex offset-1 justify-content-between pb-3">
                { isLoading ?
                    loadingElm()
                    :
                    user.user.id ?
                        <div>
                            <button  className="me-5 buttonComment"  onClick={event => displayTextEditor("comment", data.id)}>
                                <img src={ process.env.REACT_APP_URL_IMG + "commentIcon.png"} alt="répondre" height="20px" className="me-2"/>
                                    Commenter
                            </button>
                        </div>
                        :
                        <button  className="me-5 buttonComment" data-bs-toggle="modal" data-bs-target="#loginModal" >
                            <img src={ process.env.REACT_APP_URL_IMG + "commentIcon.png"} alt="répondre" height="20px" className="me-2"/>
                            Commenter
                        </button>
                    }
            </div>
            <span className="separator w-100"></span>
            { isLoading ?
                loadingElm()
                :
                idEditor === `comment${data.id}` && 
                < AddComment user={user} data={data}  setIdEditor={setIdEditor} refetch={refetch} author={"clue"} />
            }
            <div>
                {
                    isLoading ?
                    loadingElm()
                    :
                    <p className=' fw-bolder mt-2'>
                        {data.comments.length} commentaire{data.comments.length > 1 ? "s" : null}
                    </p>
                }
            </div>
            <div>
                { isLoading ? 
                    loadingElm()
                    :
                    data.comments.map( comment => 
                        < Comment  key= {comment.id + comment.status} comment={comment} idClue={data.id} refetch={refetch}/>
                )}
            </div>
        </div>
    )
}