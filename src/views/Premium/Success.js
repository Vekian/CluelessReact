import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { getFormatDatePremium } from '../../api/APIutils';
import { fetchData, getCookie } from '../../api/APIutils';
import { loadToken, loadUserMe } from '../../features/user/userSlice';
import { useDispatch} from 'react-redux';

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
            fetchData('token/refresh', 'POST', loadData, '', body)
        }
    }, [])

    function loadData(data) {
        if (data.token) {
            dispatch(loadToken(data.token));
            const userJson = JSON.parse(data.user);
            dispatch(loadUserMe(userJson));
        }
    }

    return (
        <div className='d-flex flex-column'>
            {
                user.subscriptions &&
                <>
                    <div className='d-flex justify-content-center'>
                        <>{isExploding && <ConfettiExplosion />}</>
                        <h2>
                            Félicitations pour votre abonnement { user.username } !
                        </h2>
                    </div>
                    {
                    user.subscriptions.length === 0 ?
                        <div className='mt-4'>
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
                </>
            }
        </div>
    )
}