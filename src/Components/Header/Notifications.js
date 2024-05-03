import { Link } from 'react-router-dom';
import { getDateDetail } from '../../api/APIutils';
import { useDispatch} from 'react-redux';
import { getRoute } from '../../api/APIutils';
import { changeNotification } from '../../features/user/userSlice';
import { useUpdateNotificationMutation } from '../../features/api/notificationSlice';

function Notifications(props){
    const [editNotification] = useUpdateNotificationMutation();
    const dispatch = useDispatch();

    const readNotif = async (e, oldNotification) => {
        if(!oldNotification.seen){
            const body = {
                seen: true
            };
            const bodyJson = JSON.stringify(body);
            const token = props.user.token;
            const resultNotification = await editNotification({id: e.target.dataset.id, token: token, body: bodyJson});
            
            if(resultNotification) {
                for (let notification of props.user.user.notifications){
                    if (notification.id == e.target.dataset.id){
                        dispatch(changeNotification(notification.id));
                        break;
                    }
                }
            }
        }
        
    }
    return(
        <div className="dropdown d-flex justify-content-center align-items-center notifsContener">
            {
                props.user.user.notifications && 
                <div className="d-flex justify-content-center align-items-center me-4 notifs h-100"  data-bs-toggle="dropdown">
                    <i className="fa-solid fa-bell fa-lg"></i>
                    {
                        props.user.user.notifications.filter(notification => notification.seen === false).length > 0 &&
                        <div className="d-flex align-items-start pt-2 h-100">
                            <span className="numberNotif">
                                {props.user.user.notifications.filter(notification => notification.seen === false).length}
                            </span>
                        </div>
                    }
                </div>
            }
            <ul className="dropdown-menu" >
                {
                    props.user.user.notifications &&
                    props.user.user.notifications.map((notification, index) => (
                        (index < 5 || !notification.seen) &&
                        <li key={notification.id + "notification"} className={`dropdown-item text-wrap ${notification.seen ? "" : "fw-bold"}`}>
                            <Link to={getRoute(notification)} style={{ color: 'inherit', textDecoration: 'inherit'}} data-id={notification.id} onClick={(e) => readNotif(e, notification)}>
                                 {getDateDetail(notification.createdAt)}<br/>{notification.content}
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
        
    )
}

export default Notifications;