import { getFormatDatePremium, compareValiditySubscription, fetchData, getCookie } from "../../api/APIutils"
import { useSelector } from 'react-redux';
import { loadUserMe, loadToken } from "../../features/user/userSlice";
import { useDispatch} from 'react-redux';

export default function Subscription() {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const dispatch = useDispatch();

    function unsubscribe(){
        fetch(`${process.env.REACT_APP_URL}api/stripe/unsuscribe`, 
                {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (response.ok) {
                        const cookie = getCookie('refresh_token');
                        if (cookie){
                            const body = {
                                refresh_token: cookie
                            }
                            fetchData('token/refresh', 'POST', loadData, '', body)
                        }
                    }    
                })
    }

    function loadData(data) {
        if (data.token) {
            dispatch(loadToken(data.token));
            const userJson = JSON.parse(data.user);
            dispatch(loadUserMe(userJson));
        }
    }


    return (
        <div>
            <div className='settingsItem'>
                <h3>
                    Votre abonnement
                </h3>
                {
                    user.subscriptions.length === 0 ? 
                    <p>
                        Vous ne possédez actuellement aucun abonnement
                    </p>
                    :
                    compareValiditySubscription(user.subscriptions[0].expiredAt) ?
                        user.subscriptions[0].active ?
                            <div>
                                <p>
                                Vous êtes actuellement abonné. Votre prochaine échéance aura lieu le { getFormatDatePremium(user.subscriptions[0].expiredAt)} pour un montant de { user.subscriptions[0].amount } euros.
                                </p>
                                <button className="buttonStyle bg-danger" onClick={() => unsubscribe()} >
                                    Se désabonner
                                </button>
                            </div>
                            :
                            <div>
                                <p>Votre abonnement se termine le { getFormatDatePremium(user.subscriptions[0].expiredAt) }</p>
                            </div>
                        :
                        <div>
                            <p>
                                Votre abonnement a expiré le { getFormatDatePremium(user.subscriptions[0].premiumExpiredAt)}
                            </p>
                        </div>
                }
            </div>
        </div>
    )
}