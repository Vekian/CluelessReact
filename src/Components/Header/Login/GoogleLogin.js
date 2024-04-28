import { useGoogleLogin } from '@react-oauth/google';

function GoogleLogin(props) {
    const loginGoogle = useGoogleLogin({
        onSuccess: (codeResponse) => sendAccesTokenGoogle(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    function sendAccesTokenGoogle(user){
        fetch(`${process.env.REACT_APP_URL}googlelogin`,
                    {
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    }
                )
                .then(response => {
                    if (!response.ok) {
                        console.log('erreur')
                    }    
                    return response.json()})
                .then(data => {
                    props.loadData(data);
                })
                .catch((err) => console.log(err))
    }

    return (
        <div>
            <button onClick={loginGoogle} data-bs-dismiss="modal" className="googleButton mb-4"> {props.text}  </button>
        </div>
    )

}

export default GoogleLogin;