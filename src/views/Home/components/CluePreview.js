import { getDateDetail, getLvl } from '../../../api/APIutils' ;

export default function CluePreview(props) {

    return(
        <div className="d-flex elmPreviewCard mb-2 me-3">
            <div className="d-flex flex-column align-items-center col-2">
                < img src={ process.env.REACT_APP_URL_IMG + props.elm.user.avatar} className='avatar' alt="avatar" height="30px" width="30px"/>
                <p className="userPreviewElm">
                    {props.elm.user.username}
                </p>
                <p className="lvlPreviewElm">
                    Lvl {getLvl(props.elm.user.popularity)}
                </p>
            </div>
            <div className='d-flex flex-column col-7'>
                <div className='d-flex  align-items-center me-2 '>
                    <div className=' col-9 d-flex align-items-center'>
                        <p className="timePreviewClue">
                            { getDateDetail(props.elm.createdAt)}
                        </p>
                    </div>
                </div>
                <div className='d-flex align-items-center'>
                    <p className="titlePreviewElm overflow-hidden">
                        {props.elm.title}
                    </p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <ul className="d-flex flex-wrap listTagsElmPreview">
                        {props.elm.tags.map(tag => {
                            return (
                                <li key={tag.id + props.type}  className="me-3 mb-1">
                                    {tag.category.name}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center me-2 col-3'>
                <div className="d-flex align-items-center justify-content-center">
                        <p className="numberPopularityPreviewElm">
                            {props.elm.popularity}
                        </p>
                        <img src={process.env.REACT_APP_URL_IMG + "reputation.png"} height="25px" alt="popularity"/>
                </div>
                <p className="commentsPreviewElm">
                    {props.elm.comments.length} commentaire{props.elm.comments.length > 1 ? "s" : null}
                </p>
            </div>
        </div>
    )
}