import { getDateDetail, getLvl, compareValiditySubscription } from '../../../api/APIutils' ;

export default function ElmPreview(props) {

    return(
        <div className="d-flex flex-wrap elmPreviewCard mb-2  me-3">
            <div className="d-flex flex-column align-items-center col-md-2 col-4">
                { props.elm.user ? 
                    <>
                        < img src={ process.env.REACT_APP_URL_IMG + props.elm.user.avatar} className='avatar' alt="avatar" height="30px" width="30px"/>
                        <p className={`userPreviewElm ${props.elm.user.subscriptions && compareValiditySubscription(props.elm.user.subscriptions[0]?.expiredAt) && "shiny-text"}`}>
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
            <div className="d-flex flex-column col-md-6 col-8">
                <div className='d-flex align-items-center pb-1'>
                    <p className="timePreviewElm">
                        { getDateDetail(props.elm.createdAt)}
                    </p>
                </div>
                
                <p className="titlePreviewElm overflow-hidden">
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
            <div className="d-flex flex-column col-md-4  col-12">
                <div className="d-flex align-items-center justify-content-center popularityContener">
                    <div className="d-flex align-items-center justify-content-md-end me-4 col-4">
                        <p className="numberPopularityPreviewElm">
                            {props.elm.popularity}
                        </p>
                        <img src={process.env.REACT_APP_URL_IMG + "reputation.png"} height="25px" alt="popularity"/>
                    </div>
                    <div className='col-4 d-flex justify-content-md-start justify-content-end'>
                        {
                            props.elm.status === "Validated" &&
                            <img src={process.env.REACT_APP_URL_IMG + "Checkmark.svg.png"} className='checkMark' alt="checkmark"/>
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-md-center justify-content-around">
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