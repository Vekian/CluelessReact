
function Notifications(props){
    console.log(props.user);

    return(
        <div className="d-flex justify-content-center align-items-center me-4 notifs">
            <i className="fa-solid fa-bell fa-lg"></i>
            <div className="d-flex align-items-start pt-2 h-100">
                {
                    props.user.user.notifications && 
                    <span className="numberNotif">
                        {props.user.user.notifications.length}
                    </span>
                }
            </div>
            
        </div>
    )
}

export default Notifications;