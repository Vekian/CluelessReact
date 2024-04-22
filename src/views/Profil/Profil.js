import "./Profil.css";
import { fetchData, getLvl } from "../../api/APIutils";
import { loadUserProfil, loadQuestionsUserProfil } from "../../features/user/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from 'react-chartjs-2';
import ElmPreview from "../Home/components/ElmPreview";
import { Link, useParams, useLocation } from "react-router-dom";
import EditProfil from "./EditProfil";
import EditPicture from "./EditPicture";

function Profil() {
    const dispatch = useDispatch();
    const location = useLocation();
    const userProfil= useSelector(state => state.user.userProfil);
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [editProfilState, setEditProfilState] = useState(false);
    const [editPictureState, setEditPictureState] = useState(false);
    const [sourceState, setSourceState] = useState();
    const { id } = useParams();

    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "bottom"
          },
          tooltip: {
            boxPadding: 6,
            callbacks: {
                afterLabel: function () {
                    return ("points")
                }
            }
          }
        },
      };

    ChartJS.register(ArcElement, Tooltip, Legend);

    useEffect(() => {
        if(userProfil?.user?.avatar && sourceState == null){
            setSourceState(process.env.REACT_APP_URL + userProfil.user.avatar);
        }
    }, [sourceState, userProfil]);

    useEffect(() => {
        if (id && location !== "/profils") {
            if (userProfil.user.id !== id){
                fetchData(`users/${id}`, 'GET', loadData);
                fetchData(`questions?page=1&user=${id}&order[createdAt]=desc`, 'GET', loadQuestionsData);
        }}
        else if (userProfil.user.id !== user.user_id){
            fetchData(`users/${user.user_id}`, 'GET', loadData);
            fetchData(`questions?page=1&user=${user.user_id}&order[createdAt]=desc`, 'GET', loadQuestionsData);
        }
        
    }, [])

    function loadData(data) {
        dispatch(loadUserProfil(data));
    }

    function loadQuestionsData(data) {
        let arrayData = data['hydra:member'].slice(0, 5);
        dispatch(loadQuestionsUserProfil(arrayData));
        
    }

    function parseScoreDataset(categoryMain= undefined) {
        let scores= userProfil.user.scores;
        let labels = []
        let data = [];
        let backgroundColor = [];


        for (let i=0; i<scores.length; i++) {
            if (scores[i].category) {
                if (JSON.stringify(scores[i].category.category) === JSON.stringify(categoryMain)){
                    labels.push(scores[i].category.name);
                    data.push(scores[i].points);
                    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                    backgroundColor.push(randomColor);
                }
            }
        }

        let dataset = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: backgroundColor,
                },
            ],
        }
        return dataset;
    }

    function getBestCategory(){
        let scores = userProfil.user.scores;

        let bestScore = scores[0];

        // Parcourir la liste des scores pour trouver le score le plus élevé
        for (let i = 1; i < scores.length; i++) {
            if (scores[i] > bestScore) {
                bestScore = scores[i];
            }
}       return bestScore.category;
    }

    return (
        <div>
            {
                editProfilState ?
                <div className="d-flex flex-column offset-1 col-10 profilDescription">
                    < EditProfil user={user} userProfil={userProfil} editProfilState= {editProfilState} setEditProfilState={setEditProfilState} token={token} />
                </div>
                    : 
                    <div className="d-flex flex-column offset-1 col-10 profilDescription">
                    <div className="d-flex" >
                        <div className="d-flex flex-column align-items-center">
                            {userProfil.user.avatar && 
                                <div  className="text-center mb-1">
                                    <img  src={sourceState} id="avatarPicture" alt="avatar" height="80px" width="80px"/>
                                </div>
                            }
                            {
                                editPictureState ?
                                < EditPicture editPictureState= {editPictureState} setEditPictureState={setEditPictureState} token={token} setSourceState={setSourceState} userProfil={userProfil} />
                                :
                                <button className="buttonStyle buttonPicture text-center" onClick={() => setEditPictureState(!editPictureState)}>
                                    Changer avatar
                                </button>
                            }
                        </div>
                        <div className="d-flex align-items-end  justify-content-between w-100 ">
                            <div className="d-flex align-items-end">
                                <h3 className="ms-4 me-3 mb-0">
                                    {userProfil.user.username}
                                </h3>
                                <h5 className="mb-1">
                                    lvl {getLvl(userProfil.user.popularity)}
                                </h5>
                            </div>
                            <div>
                                <button className="buttonStyle" onClick={() => setEditProfilState(!editProfilState)}>
                                    Éditer le profil
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-2">
                        <div className="d-flex flex-column align-items-center justify-content-center col-1">
                            <h6>
                                {userProfil.user.sex}, <br />{userProfil.user.age} ans
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
                            <div className="d-flex  justify-content-between">
                                <h5 className="fw-normal">
                                    {userProfil.user.description}
                                </h5>
                                <ul className=" listTagsElmPreview d-flex align-items-center">
                                    { userProfil.user.tags ?
                                        userProfil.user.tags.map( tag => 
                                            <li key={tag.id ? tag.id : "general"} className="me-3">
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
                <div className="d-flex justify-content-around">
                    <div className="charts d-flex flex-column align-items-center">
                        <h5 className="mb-2">
                            Scores globaux
                        </h5>
                        {
                            userProfil.user.scores && userProfil.user.scores.length > 0 ?
                            <Doughnut
                                data={parseScoreDataset()} 
                                options={options}
                            /> : null
                        }
                    </div>
                    <div className="charts d-flex flex-column align-items-center">
                        <h5 className="mb-2">
                            Scores de votre section préférée
                        </h5>
                        {
                            userProfil.user.scores && userProfil.user.scores.length > 0 ?
                            <Doughnut
                                data={parseScoreDataset(getBestCategory())} 
                                options={options}
                            /> : null
                        }
                    </div>
                </div>
            </div>
            <div className="offset-1 col-10 mt-4">
                <h4>
                    Dernières questions posées
                </h4>
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
            </div>
        </div>
    )
}

export default Profil;