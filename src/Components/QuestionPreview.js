import { getDateDetail, getLvl } from '../api/APIutils' ;

function QuestionPreview(props) {


    return(
        <div className="d-flex questionPreviewCard mb-1">
            <div className="d-flex flex-column align-items-center col-2">
                < img src={ process.env.REACT_APP_URL + props.question.user.avatar} alt="avatar" height="30px" width="30px"/>
                <p className="userPreviewQuestion">
                    {props.question.user.username}
                </p>
                <p className="lvlPreviewQuestion">
                    Lvl {getLvl(props.question.user.popularity)}
                </p>
            </div>
            <div className="d-flex flex-column col-7">
                <p className="timePreviewQuestion">
                    { getDateDetail(props.question.createdAt)}
                </p>
                <p className="titlePreviewQuestion">
                    {props.question.title}
                </p>
                <ul className="d-flex listTagsQuestionPreview">
                    {props.question.tags.map(tag => {
                        return (
                            <li key={tag.id}  className="me-3">
                                {tag.category.name}
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className="d-flex flex-column col-3">
                <div className="d-flex align-items-center justify-content-center">
                    <div className=" text-center me-4">
                        <p className="numberPopularityPreviewQuestion">
                            {props.question.popularity}
                        </p>
                        <p className="textPopularityPreviewQuestion">
                            popularité
                        </p>
                    </div>
                    <img src="assets/images/valide.png" height="40px" alt="checkmark"/>
                </div>
                <div className="d-flex justify-content-center">
                    <p className="commentsPreviewQuestion me-3">
                        {props.question.comments.length} commentaire{props.question.comments.length > 1 ? "s" : null}
                    </p>
                    <p className="answersPreviewQuestion">
                        {props.question.answers.length} réponse{props.question.answers.length > 1 ? "s" : null}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default QuestionPreview;