import { getDateDetail, getLvl } from '../api/APIutils' ;

function Comment(props) {
    return (
        <div className='d-flex flex-column offset-1 mt-2 mb-2 border border-top-0 border-start-0 '>
            <div className="d-flex p-2">
                <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-2 me-3">
                        <div className='d-flex align-items-end'>
                            <img src={ process.env.REACT_APP_URL + props.comment.user.avatar} alt="avatar" height="15px" width="15px" />
                            <span className='ms-2'>
                                {props.comment.user.username}
                            </span>
                            <span>
                                lvl { getLvl(props.comment.user.popularity)}
                            </span>
                        </div>
                        <div>
                            {getDateDetail(props.comment.createdAt)}
                        </div>
                    </div>
                    <div>
                        {props.comment.content}
                    </div>
                </div>
                <div className='d-flex flex-column justify-content-center align-items-center commentVote'>
                    <i className="fa-solid fa-circle-up"></i>
                        <h5 className="mb-2 mt-2">{props.comment.popularity}</h5>
                    <i className="fa-solid fa-circle-down"></i>
                </div>
            </div>
        </div>
        
    )
}

export default Comment;