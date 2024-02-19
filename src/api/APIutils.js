import moment from 'moment-timezone';


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


export function getLvl(popularity) {
  return Math.floor(Math.log(popularity / 100) / Math.log(1.2));
}


export function fetchData(url, method, processData, token = null, bodyData = null) {
  let body = bodyData;
  let headers = "";
  let credentials = "omit";

  if (method === 'POST') {
    body = JSON.stringify(bodyData);
    if (url === 'login_check' || url === 'token/refresh') {
      headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      credentials = 'include';
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

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  fetch(`http://clueless.dvl.to/api/${url}`, 
    {
        method: method,
        headers: headers,
        body: body
    })
    .then(response => {
      if (!response.ok) {
      }    
      return response.json()})
    .then(data => {
      processData(data);
    })
  
}