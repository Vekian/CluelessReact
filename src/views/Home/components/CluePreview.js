import { getDateDetail, getLvl } from '../../../api/APIutils' ;

function CluePreview(props) {

    return(
        <div className="d-flex elmPreviewCard mb-2 me-3">
            <div className="d-flex flex-column align-items-center col-2">
                < img src={ process.env.REACT_APP_URL + props.elm.user.avatar} alt="avatar" height="30px" width="30px"/>
                <p className="userPreviewElm">
                    {props.elm.user.username}
                </p>
                <p className="lvlPreviewElm">
                    Lvl {getLvl(props.elm.user.popularity)}
                </p>
            </div>
            <div className='d-flex flex-column col-10'>
                <div className='d-flex  align-items-center me-2 '>
                    <div className=' col-9 d-flex align-items-center'>
                        <p className="timePreviewClue">
                            { getDateDetail(props.elm.createdAt)}
                        </p>
                    </div>
                    
                    <div className='d-flex align-items-center offset-1'>
                        <p className="numberPopularityPreviewClue">
                            {props.elm.popularity}
                        </p>
                        <i className="fa-solid fa-star ms-1" style={{color: "#FFD43B",}}></i>
                    </div>
                    
                </div>
                <div className='d-flex align-items-center'>
                    <p className="titlePreviewElm overflow-hidden">
                        {props.elm.title}
                    </p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <ul className="d-flex listTagsElmPreview">
                        {props.elm.tags.map(tag => {
                            return (
                                <li key={tag.id + props.type}  className="me-3">
                                    {tag.category.name}
                                </li>
                            )
                        })}
                    </ul>
                    <p className="commentsPreviewElm me-3">
                        {props.elm.comments.length} commentaire{props.elm.comments.length > 1 ? "s" : null}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CluePreview;