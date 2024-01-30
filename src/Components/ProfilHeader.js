import { getLvl } from '../api/APIutils' ;
import { Link } from 'react-router-dom';
function ProfilHeader (props) {


    return (
        <Link to={`/profil/${props.user.user_id}`} className="d-flex align-items-center" style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <img src={ process.env.REACT_APP_URL + props.user.avatar} alt="avatar"  height="30px" width="30px" className='me-2' />
            <div className='d-flex flex-column align-items-center'>
                <h4>
                    {props.user.username}
                </h4>
                <div className='d-flex'>
                    <h6>
                        Lvl {getLvl(props.user.popularity)}
                    </h6>
                    <h6>
                        Log out
                    </h6>
                </div>
                
            </div>
        </Link>
    )
}

export default ProfilHeader;