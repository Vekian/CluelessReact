import './Clue.css';
import { useParams, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDateDetail, getLvl } from '../../api/APIutils' ;
import Comment from '../../Components/Comment';
import TextArea from '../../Components/TextArea';
import VoteElement from '../Question/VoteElement';
import { useGetClueQuery } from '../../features/api/clueSlice';
import { useAddCommentMutation } from '../../features/api/commentSlice';
import { loadingElm } from '../../ui/UIutils';
import { voteApi } from '../../features/api/voteSlice';

function Clue() {
    const user = useSelector(state => state.user);
    const [idEditor, setIdEditor] = useState();
    const [contentToSend, setContentToSend] = useState();
    const { id } = useParams();

    const [trigger] = voteApi.useLazyGetVotesQuery();
    const { data, error, isLoading, refetch } = useGetClueQuery(id)
    const [addComment] = useAddCommentMutation();
    

    useEffect(() => {
        if (user.token) {
            trigger({url: `?clue=${id}`, token: user.token});
        }
    }, [user]);

    useEffect(() => {
        if (data && idEditor){
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

    const addCommentData = async () => {
        const body = {
            content: contentToSend,
            user: `/api/users/${user.user.id}`,
            clue: `/api/clues/${data.id}`,
        }
        const token = user.token;
        const bodyJson = JSON.stringify(body);
        const resultComment = await addComment({body: bodyJson, token: token});
        if (resultComment.data) {
            setIdEditor(`commentElm${resultComment.data.id}`);
            refetch(id);
        }
    }

    return (
        <div className="d-flex flex-column pt-2 clueDetail">
            <span className="separator w-100"></span>
            <div className="d-flex justify-content-between align-items-start pt-2">
                { isLoading ? 
                    loadingElm()
                    :
                    <Link to={`/profils/${data.user.id}`} className="d-flex  linkToProfil" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                        <img src={ process.env.REACT_APP_URL + data.user.avatar} className='avatar' alt="avatar" height="50px" width="50px" />
                        <div className="ps-3">
                            <h4>
                                { data.user.username }
                            </h4>
                            <h6>
                                lvl {getLvl( data.user.popularity )}
                            </h6>
                        </div>
                    </Link>
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
                            <p className="text-end mb-1 pt-2">
                            { getDateDetail(data.createdAt)}
                            </p>
                    }
                    
                </div>
            </div>
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
                        <div className='d-flex align-items-start'>
                            <div dangerouslySetInnerHTML={{ __html: data.content }} className='mt-3' />
                        </div>
                    </>
                }
            </div>
            <div className="d-flex offset-1 justify-content-between pb-3">
                { isLoading ?
                    loadingElm()
                    :
                    <div>
                    <button  className="me-5 buttonComment"  onClick={event => displayTextEditor("comment", data.id)}>
                        <img src={ process.env.REACT_APP_URL + "commentIcon.png"} alt="répondre" height="20px" className="me-2"/>
                            Commenter
                        </button>
                    </div>
                    }
            </div>
            <span className="separator w-100"></span>
            { isLoading ?
                loadingElm()
                :
                idEditor === `comment${data.id}` && 
                <>
                    < TextArea id={`comment${data.id}`}  setContent={setContentToSend} class={'comment'} /> 
                    <button className="buttonStyle" onClick={() => addCommentData()}>Envoyer</button>
                    <div>
                        <p className=' fw-bolder mt-2'>
                            {data.comments.length} commentaire{data.comments.length > 1 ? "s" : null}
                        </p>
                    </div>
                </>
            }
            
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

export default Clue;