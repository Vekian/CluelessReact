import { getDateDetail, getLvl } from '../../../api/APIutils' ;

function ElmPreview(props) {

    return(
        <div className="d-flex elmPreviewCard mb-2 me-3">
            <div className="d-flex flex-column align-items-center col-2">
                { props.elm.user ? 
                    <>
                        < img src={ process.env.REACT_APP_URL_IMG + props.elm.user.avatar} className='avatar' alt="avatar" height="30px" width="30px"/>
                        <p className="userPreviewElm">
                            {props.elm.user.username}
                        </p>
                        <p className="lvlPreviewElm">
                            Lvl {getLvl(props.elm.user.popularity)}
                        </p>
                    </>
                    :
                    <>
                        < img src={ process.env.REACT_APP_URL_IMG + props.user.avatar} alt="avatar" height="30px" width="30px"/>
                        <p className="userPreviewElm">
                            {props.user.username}
                        </p>
                        <p className="lvlPreviewElm">
                            Lvl {getLvl(props.user.popularity)}
                        </p>
                    </>
                }
                
            </div>
            <div className="d-flex flex-column col-6">
                <div className='d-flex align-items-center pb-1'>
                    <p className="timePreviewElm">
                        { getDateDetail(props.elm.createdAt)}
                    </p>
                </div>
                
                <p className="titlePreviewElm">
                    {props.elm.title}
                </p>
                <ul className="d-flex flex-wrap listTagsElmPreview">
                    {props.elm.tags.map(tag => {
                        return (
                            <li key={props.type ? (tag.id + props.type) : (tag.id + "profil")}  className="me-3 mb-1">
                                {tag.category.name}
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className="d-flex flex-column col-4">
                <div className="d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-end me-4 col-4">
                        <p className="numberPopularityPreviewElm">
                            {props.elm.popularity}
                        </p>
                        <i className="fa-solid fa-star ms-1" style={{color: "#FFD43B",}}></i>
                    </div>
                    <img src={process.env.REACT_APP_URL_IMG + "Checkmark.svg.png"} height="40px" alt="checkmark"/>
                </div>
                <div className="d-flex justify-content-center">
                    <p className="commentsPreviewElm me-3">
                        {props.elm.comments.length} commentaire{props.elm.comments.length > 1 ? "s" : null}
                    </p>
                    {props.elm.answers ? 
                        <p className="answersPreviewElm">
                            {props.elm.answers.length} réponse{props.elm.answers.length > 1 ? "s" : null}
                        </p> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default ElmPreview;