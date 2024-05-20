import "./Profil.css";
import { fetchData, getLvl, compareValiditySubscription } from "../../api/APIutils";
import { loadUserProfil, loadQuestionsUserProfil } from "../../features/user/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import ElmPreview from "../Home/components/ElmPreview";
import { Link, useParams, useLocation } from "react-router-dom";
import EditProfil from "./EditProfil";
import EditPicture from "./EditPicture";
import ScoreProfil from "./ScoreProfil";
import { ThreeDots } from 'react-loader-spinner';

export default function Profil() {
    const dispatch = useDispatch();
    const location = useLocation();
    const userProfil= useSelector(state => state.user.userProfil);
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [editProfilState, setEditProfilState] = useState(false);
    const [editPictureState, setEditPictureState] = useState(false);
    const [sourceState, setSourceState] = useState();
    const [userFetchingState, setUserFetchingState] = useState(false);
    const [questionsFetchingState, setQuestionsFetchingState] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        if(userProfil?.user?.avatar && (userProfil?.user?.id !== user.id || !sourceState)){
            setSourceState(process.env.REACT_APP_URL_IMG + userProfil.user.avatar);
        }
    }, [sourceState, userProfil]);

    useEffect(() => {
        if (id && location.pathname !== "/profil") {
            if (userProfil.user.id !== id){
                setUserFetchingState(true);
                fetchData(`users/${id}`, 'GET', loadData);
                setQuestionsFetchingState(true);
                fetchData(`questions?page=1&user=${id}&order[createdAt]=desc`, 'GET', loadQuestionsData);
        }}
        else if (user?.id){
            dispatch(loadUserProfil(user));
            setQuestionsFetchingState(true);
            fetchData(`questions?page=1&user=${user.id}&order[createdAt]=desc`, 'GET', loadQuestionsData);
        }
        else {
            setUserFetchingState(true);
            fetchData(`users/${user.id}`, 'GET', loadData);
            setQuestionsFetchingState(true);
            fetchData(`questions?page=1&user=${user.id}&order[createdAt]=desc`, 'GET', loadQuestionsData);
        }
        
    }, [])

    function loadData(data) {
        dispatch(loadUserProfil(data));
        setUserFetchingState(false);
    }

    function loadQuestionsData(data) {
        let arrayData = data['hydra:member'].slice(0, 5);
        dispatch(loadQuestionsUserProfil(arrayData));
        setQuestionsFetchingState(false);
    }

    return (
        <div>
            {
                editProfilState ?
                <div className="d-flex flex-column offset-1 col-10 profilDescription">
                    < EditProfil user={user} userProfil={userProfil} editProfilState= {editProfilState} setEditProfilState={setEditProfilState} token={token} />
                </div>
                : 
                    userFetchingState ?
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <ThreeDots
                            visible={true}
                            height="60"
                            width="60"
                            color="#000"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                    :
                    <div className="d-flex flex-column offset-1 col-10 profilDescription">
                        <div className="d-flex" >
                            <div className="d-flex flex-column align-items-center">
                                {userProfil.user.avatar && 
                                    <div  className="text-center mb-1">
                                        <img  src={sourceState} className="avatar" id="avatarPicture" alt="avatar" height="80px" width="80px"/>
                                    </div>
                                }
                                {
                                    userProfil.user.id === user.id &&
                                    <>
                                    {
                                        editPictureState ?
                                        < EditPicture editPictureState= {editPictureState} setEditPictureState={setEditPictureState} token={token} setSourceState={setSourceState} userProfil={userProfil} />
                                        :
                                        <button className="buttonStyle buttonPicture text-center" onClick={() => setEditPictureState(!editPictureState)}>
                                            Changer avatar
                                        </button>
                                    }
                                    </>
                                } 
                            </div>
                            <div className="d-flex flex-wrap align-items-end  justify-content-between w-100 ">
                                <div className="d-flex align-items-end">
                                    <h3 className={`ms-4 me-3 mb-0 ${(userProfil.user.subscriptions && compareValiditySubscription(userProfil.user.subscriptions[0]?.expiredAt)) && "shiny-text"}`}>
                                        {userProfil.user.username}
                                    </h3>
                                    <h5 className="mb-1">
                                        lvl {getLvl(userProfil.user.popularity)}
                                    </h5>
                                </div>
                                {
                                    userProfil.user.id === user.id &&
                                    <>
                                    <div>
                                        <button className="buttonStyle ms-2" onClick={() => setEditProfilState(!editProfilState)}>
                                            Éditer le profil
                                        </button>
                                    </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="d-flex mt-2">
                            <div className="d-flex flex-column align-items-center justify-content-center col-lg-1 col-3 col-sm-2">
                                <h6>
                                     {userProfil.user.age} ans {userProfil.user.sex === "homme" ? <i class="fa-solid fa-mars text-primary"></i> : <i class="fa-solid fa-venus"></i>}
                                </h6>
                                <h6>
                                    {userProfil.user.country}
                                </h6>
                            </div>
                            <div className="ms-4 w-100">
                                <h5 className="fw-normal">
                                    {userProfil.user.firstname} {userProfil.user.lastname}
                                </h5>
                                <div className="separator mt-2 mb-3 ms-3"></div>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <h6 className="fw-normal col-lg-6 col-12">
                                        {userProfil.user.description}
                                    </h6>
                                    <ul className=" listTagsElmPreview col-lg-6 col-12 d-flex justify-content-lg-end flex-wrap align-items-center">
                                        { userProfil.user.tags ?
                                            userProfil.user.tags.map( tag => 
                                                <li key={tag.id ? tag.id : "general"} className="me-sm-3 me-1 mb-1">
                                                    {tag.category.name}
                                                </li>
                                            ) :null
                                        }
                                    </ul>
                                </div> 
                            </div>
                        </div>
                    </div>
            }
            <div className="offset-1 col-10 mt-4">
                <h4 className="mb-3">
                    Scores
                </h4>
                {
                    questionsFetchingState ?
                    <div className="d-flex align-items-center justify-content-center mt-5">
                        <ThreeDots
                            visible={true}
                            height="60"
                            width="60"
                            color="#000"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                    :
                    < ScoreProfil userProfil={userProfil} />
                }
            </div>
            <div className="offset-1 col-10 mt-5">
                <h4>
                    Dernières questions posées
                </h4>
                {
                    questionsFetchingState ?
                    <div className="d-flex align-items-center justify-content-center mt-5">
                        <ThreeDots
                            visible={true}
                            height="60"
                            width="60"
                            color="#000"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                    :
                    <div className="mt-3">
                        { userProfil.questions && userProfil.questions.length > 0 ?
                        userProfil.questions.map(question =>
                            <Link to={`/question/${question.id}`} style={{ color: 'inherit', textDecoration: 'inherit'}}  key={question.id + "question"}>
                                < ElmPreview elm={question} user={userProfil}/>
                            </Link>
                            ): 
                            <div>
                                <h4>
                                    Pas de questions posées par {userProfil.username}
                                </h4>
                            </div>}
                    </div>
                }
            </div>
        </div>
    )
}