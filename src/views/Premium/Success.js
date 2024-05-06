import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { getFormatDatePremium } from '../../api/APIutils';

export default function Success(){
    const [isExploding, setIsExploding] = useState(false);
    const user = useSelector(state => state.user.user);

    useEffect(() => {
        setIsExploding(true);
    }, [])

    return (
        <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
                <>{isExploding && <ConfettiExplosion />}</>
                <h2>
                    Félicitations pour votre abonnement { user.username } !
                </h2>
            </div>
            <div className='mt-4'>
                <p>
                    Votre abonnement se terminera le { getFormatDatePremium(user.premiumExpiredAt)}
                </p>
            </div>
        </div>
    )
}