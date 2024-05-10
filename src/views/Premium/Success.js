import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { getFormatDatePremium, getCookie } from '../../api/APIutils';
import { useDispatch} from 'react-redux';
import { loadToken, loadUserMe } from '../../features/user/userSlice';

export default function Success(){
    const dispatch = useDispatch();
    const [isExploding, setIsExploding] = useState(false);
    const user = useSelector(state => state.user.user);


    useEffect(() => {
        setIsExploding(true);

        const cookie = getCookie('refresh_token');
        if (cookie){
            const body = {
                refresh_token: cookie
            }
            const bodyJson = JSON.stringify(body);
            fetch(`${process.env.REACT_APP_URL}api/token/refresh`, 
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: bodyJson
                })
                .then(response => {
                    if (!response.ok) {
                        console.log(response)
                    }    
                    return response.json()
                })
                .then(data => {
                    if (data.token) {
                        dispatch(loadToken(data.token));
                        const userJson = JSON.parse(data.user);
                        dispatch(loadUserMe(userJson));
                    }
                })
        }
    }, [])

    return (
        <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
                <>{isExploding && <ConfettiExplosion />}</>
                <h2>
                    Félicitations pour votre abonnement { user.username } !
                </h2>
            </div>
            {
                !user.subscriptions ?
                    <div>
                        <p>
                            Votre abonnement est actuellement en cours de validation, patientez un petit moment, ça ne devrait plus tarder.
                        </p>
                    </div>
                    :
                    <div className='mt-4'>
                        <p>
                            Votre abonnement se renouvellera automatiquement le { getFormatDatePremium(user.subscriptions[0].premiumExpiredAt)}
                        </p>
                    </div>
            }
        </div>
    )
}