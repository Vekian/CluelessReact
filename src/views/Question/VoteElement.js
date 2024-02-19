import { useSelector } from 'react-redux';
import { voteApi } from '../../features/api/voteSlice';
import { useAddVoteMutation } from '../../features/api/voteSlice';
import { useUpdateVoteMutation } from '../../features/api/voteSlice';
import { useDeleteVoteMutation } from '../../features/api/voteSlice';

function VoteElement(props) {
    const user = useSelector(state => state.user);
    const votes = voteApi.endpoints.getVotes.useQueryState({url: `?${props.typeParent}=${props.idParentElm}`, token: user.JWBToken.token});
    const [updateVote] = useUpdateVoteMutation();
    const [ addVote ] = useAddVoteMutation();
    const [deleteVote] = useDeleteVoteMutation();

    const sendNewVote = async (amount) => {
        let body = {
            "amount": amount,
            "user": `/api/users/${user.user.user_id}`
        };

        body[props.typeParent] = `/api/${props.typeParent}s/${props.idParentElm}`;
        if (props.class1 === "answer") {
            body.answer = `/api/answers/${props.idAnswer}`;
        }
        else if (props.class1 === "comment") {
            body.comment = `/api/comments/${props.idComment}`;
        }
        let bodyJson = JSON.stringify(body);
        const resultVote = await addVote({body: bodyJson, token: user.JWBToken.token});
        if (resultVote.data) {
            props.refetch(props.idParentElm);
        }
    }

    const sendDeleteVote = async (vote) => {
        const resultVote = await deleteVote({id: vote.id, token: user.JWBToken.token });
        if (resultVote) {
            props.refetch(props.idParentElm);
        }
    }

    const sendUpdateVote = async (amount, vote) => {
        let body = {
            "amount": amount
        };
        let bodyJson = JSON.stringify(body);
        const resultVote = await updateVote({id: vote.id, token: user.JWBToken.token, body: bodyJson});
        if (resultVote.data) {
            props.refetch(props.idParentElm);
        }
    }

    function sendVote(amount){
        if (votes.currentData['hydra:member'].length > 0){
            let vote;
            for (let voteData of votes.currentData['hydra:member']){
                if (voteData.question === props.idElm || voteData.clue === props.idElm || voteData.answer === props.idElm || voteData.comment === props.idElm) {
                    vote = voteData;
                    
                    break;
                }
            }
            if (vote) {
                if ((amount > 0 && vote.amount > 0) || (amount < 0 && vote.amount < 0)) {
                   sendDeleteVote(vote);
                }
                else {
                    sendUpdateVote(amount, vote);
                }
            }
            else {
                sendNewVote(amount);
            }
        }
        else {
            sendNewVote(amount);
        }
    }
    
    function checkVote() {
        if (votes.isSuccess){
            if (votes.currentData['hydra:member'].length > 0){
            for (let vote of votes.currentData['hydra:member']){
                if (vote.question === props.idElm || vote.clue === props.idElm || vote.answer === props.idElm || vote.comment === props.idElm) {
                    return vote.amount;
                }
            }
        }
        }
    }
    return(
        <div className={`col-1 d-flex flex-column justify-content-center align-items-center ${props.class1}Vote ${props.class2}`}>
            <div className='text-center'>
                {user.user.username && user.user.user_id !== props.idAuthor ? <i className={ checkVote() > 0 ? "fa-solid fa-circle-up display-6" : "fa-solid fa-circle-up "} onClick={event => sendVote(2)}></i>
                : null}
                    <h5 className={props.class2}>{props.popularity} <i className="fa-solid fa-star" style={{color: "#FFD43B",}}></i></h5>
                {user.user.username && user.user.user_id !== props.idAuthor ? <i className={ checkVote() < 0 ? "fa-solid fa-circle-down display-6" : "fa-solid fa-circle-down "} onClick={event => sendVote(-2)}></i>
                : null }
            </div> 
        </div>
    )
}

export default VoteElement;