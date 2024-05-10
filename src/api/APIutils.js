import moment from 'moment-timezone';
import 'moment/locale/fr'; 


export function getDateDetail (dateData) {
  
  const dateObject = moment(dateData);
  const actualTime = moment();

  const diffInMinutes = actualTime.diff(dateObject, 'minutes');
  const diffInHours = actualTime.diff(dateObject, 'hours');
  const diffInMonths = actualTime.diff(dateObject, 'months');
  const diffInDays = actualTime.diff(dateObject, 'days');
  const diffInYears = actualTime.diff(dateObject, 'years');
  

  let resultString = '';
    if (diffInYears > 0) {
      resultString = `Il y a ${diffInYears} ${diffInYears === 1 ? 'an' : 'ans'}`;
    } else if (diffInMonths > 0) {
      resultString = `Il y a ${diffInMonths} ${diffInMonths === 1 ? 'mois' : 'mois'}`;
    } else if (diffInDays > 0) {
      resultString = `Il y a ${diffInDays} ${diffInDays === 1 ? 'jour' : 'jours'}`;
    } else  if (diffInHours > 0){
      resultString = `Il y a ${diffInHours} ${diffInHours === 1 ? 'heure' : 'heures'}`;
    } else {
      resultString = `Il y a ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`;
    }
    

    return resultString;
}

export function getFormatDatePremium(date) {
  moment.locale('fr');
  const formatedDate = moment(date).format('LL');
  return formatedDate
}

export function compareValiditySubscription(date) {
  const actualDate = moment();
  const expirationDate = moment(date);

  if (expirationDate.isAfter(actualDate)) {
    return true;
  }
  else {
    return false;
  }
}

export function getLvl(popularity) {
  let lvl = 1;
  let basePop = 15;
  while (popularity >= basePop) {
    lvl ++;
    popularity -= basePop;
    basePop += 10;
  }
  return lvl;
}


export function fetchData(url, method, processData, token = null, bodyData = null, errorData = null) {
  let body = bodyData;
  let headers = "";

  if (method === 'POST') {
    body = JSON.stringify(bodyData);
    if (url === 'login_check' || url === 'token/refresh') {
      headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
    }
    else {
      headers = {
        'Accept': 'application/ld+json',
        'Content-Type': 'application/ld+json',
      };
    }
  }
  else if (method === 'GET') {
    headers= {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }
  else if (method === 'PUT') {
    body = JSON.stringify(bodyData);
    headers = {
      'Accept': 'application/ld+json',
      'Content-Type': 'application/ld+json',
    };
  }
  else if (method === 'PATCH') {
    body = JSON.stringify(bodyData);
    headers = {
      'Accept': 'application/ld+json',
      'Content-Type': 'application/merge-patch+json',
    };
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  fetch(`${process.env.REACT_APP_URL}api/${url}`, 
    {
        method: method,
        headers: headers,
        body: body
    })
    .then((response) => {
      if (!response.ok) {
        return response.text().then(text => {
            throw new Error(text);
        })
      }
      else {
          return response.json()
      }
      })
    .then(data => {
      processData(data);
    })
    .catch(error =>{
      if( errorData){
        const errorMessage = error.message.replace(/[\\"]/g, '').replace(/"/g, '');
        errorData(errorMessage)
      }
    }
  );
}

export function getCookie(name){
  if(document.cookie.length == 0)
    return null;

  var regSepCookie = new RegExp('(; )', 'g');
  var cookies = document.cookie.split(regSepCookie);

  for(var i = 0; i < cookies.length; i++){
    var regInfo = new RegExp('=', 'g');
    var infos = cookies[i].split(regInfo);
    if(infos[0] == name){
      return unescape(infos[1]);
    }
  }
  return null;
}

export function getRoute(notification){
    let route= "";
    if (notification.question){
      route = `/question/${notification.question.id}`;
    }
    else if (notification.clue){
      route = `/clue/${notification.clue.id}`;
    }
    return route
}