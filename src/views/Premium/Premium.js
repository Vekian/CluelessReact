import getStripe from '../../lib/getStripe';
import { compareValiditySubscription } from '../../api/APIutils';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import './Premium.css';
import { Comment } from 'react-loader-spinner';

export default function Premium() {
    const user = useSelector(state => state.user);
    const [isFetchingMensuel, setIsFetchingMensuel] = useState(false);
    const [isFetchingAnnuel, setIsFetchingAnnuel] = useState(false);

    async function handleCheckout(sessionId) {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
            sessionId: sessionId
        });
        console.warn(error.message);
      }
    
    function fetchSession(type){
        type === "mensuel" ? setIsFetchingMensuel(true) : setIsFetchingAnnuel(true);
        let bodyJson = JSON.stringify({
            id: user.user.id,
            months: type === "mensuel" ? 1 : 12,
            type: type
        })
        fetch(`${process.env.REACT_APP_URL}api/session-stripe`, 
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
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
                handleCheckout(data.sessionId);
            })
    }

    return (
        <div>
            <div className="text-center mt-2 d-flex flex-column">
                <h2>
                    Devenir premium
                </h2>
                <p>
                    Devenez un membre premium, contribuez au développement du site et profitez de multiples avantages!
                </p>
                <div className='d-flex flex-wrap col-10 offset-1 mt-3'>
                   <div className='d-flex flex-column col-5 text-start contener-item-premium mb-4'>
                        <div className='title-item'>
                            Gagnez en visibilité
                        </div>
                        <div className='content-item d-flex  align-items-center'>
                            <img src={ process.env.REACT_APP_URL_IMG + "assets/visibility.png"} alt="visibilité" height="100px" />
                            <p className='text-start mt-2 ms-2'>
                                Vos questions apparaitront plus facilement en page d'accueil et seront affichés en priorité dans les recherches.
                            </p>
                        </div>
                    </div> 
                    <div className='d-flex flex-column offset-2 col-5 text-start contener-item-premium mb-4'>
                        <div className='title-item'>
                            Améliorez vos probabilités de réponses
                        </div>
                        <div className='content-item d-flex align-items-center'>
                            <img src={ process.env.REACT_APP_URL_IMG + "assets/popularity.png"} alt="visibilité" height="100px" />
                            <p className='text-start mt-2 ms-2'>
                                Une réponse que vous validez accorde plus de points à l'auteur de la réponse. <br /> Les helpers vont vous adorer.
                            </p>
                        </div>
                    </div> 
                    <div className='d-flex flex-column col-5 text-start mb-4 contener-item-premium'>
                        <div className='title-item'>
                            Plus de votes, encore plus de votes
                        </div>
                        <div className='content-item d-flex  align-items-center'>
                            <img className='p-2' src={ process.env.REACT_APP_URL_IMG + "assets/vote.png"} alt="visibilité" height="100px" />
                            <p className='text-start mt-2 ms-2'>
                                Contrairement à un compte gratuit, vous n'avez pas de limite de votes. <br /> De plus vos points rapportent plus !
                            </p>
                        </div>
                    </div>
                    <div className='d-flex flex-column offset-2 col-5 text-start mb-4 contener-item-premium'>
                        <div className='title-item'>
                            Ayez un look d'enfer
                        </div>
                        <div className='content-item d-flex align-items-center'>
                            <img src={ process.env.REACT_APP_URL_IMG + "assets/crown.png"} alt="visibilité" height="100px" />
                            <p className='text-start mt-2 ms-2'>
                                Débloquez un magnifique cadre pour votre avatar ! <br /> Montrez votre prestance aux autres membres du site.
                            </p>
                        </div>
                    </div> 
                    <div className='col-6'>
                        <div className='d-flex flex-column justify-content-center me-3 contenerAbo mb-2 mt-2'>
                            <div>
                                <h3>
                                    Abonnement Mensuel
                                </h3>
                                <p>
                                    10€ par mois
                                </p>
                            </div>
                            {
                                isFetchingMensuel ? 
                                <div className='d-flex justify-content-center'>
                                    <Comment
                                        visible={true}
                                        height="120"
                                        width="120"
                                        ariaLabel="comment-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="comment-wrapper"
                                        color="#fff"
                                        backgroundColor="var(--tertiaryColor)"
                                    />
                                </div>
                                :
                                user.user.subscriptions && compareValiditySubscription(user.user.subscriptions[0]?.expiredAt) ?
                                <button className="buttonPremium col-6 offset-3" disabled>
                                    Vous êtes déjà abonnés
                                </button>
                                :
                                <button className="buttonPremium col-6 offset-3" onClick={() => fetchSession('mensuel')}>S'abonner</button>
                            }
                        </div>
                    </div>
                    <div className='col-6'>
                       <div className='d-flex flex-column ms-3 justify-content-center contenerAbo  mb-2 mt-2'>
                            <div>
                                <h3>
                                    Abonnement Annuel
                                </h3>
                                <p>
                                    100€ par an
                                </p>
                            </div>
                            {
                                isFetchingAnnuel ? 
                                <div className='d-flex justify-content-center'>
                                   <Comment
                                        visible={true}
                                        height="120"
                                        width="120"
                                        ariaLabel="comment-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="comment-wrapper"
                                        color="#fff"
                                        backgroundColor="var(--tertiaryColor)"
                                    /> 
                                </div>
                                :
                                user.user.subscriptions && compareValiditySubscription(user.user.subscriptions[0]?.expiredAt) ?
                                <button className="buttonPremium col-6 offset-3" disabled>
                                    Vous êtes déjà abonnés
                                </button>
                                :
                                <button className="buttonPremium col-6 offset-3" onClick={() => fetchSession('annuel')}>S'abonner</button>
                            }
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    )
}