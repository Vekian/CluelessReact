import './App.css';
import Header from './Header/Header';
import Sidemenu from './Sidemenu/Sidemenu';
import SubMenu from './Submenu/Submenu';
import Main from './Main';
import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UIContext } from './UIProvider';
import Login from '../Components/Header/Login/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const {darkMode} = useContext(UIContext);
        

  return (
    <div className={`App vh-100 ${darkMode ? 'dark' : 'light'}`}>
      <GoogleOAuthProvider clientId="1047880689996-3jmsj1nv0ekn34ur1h2r1rjonbbvgiuf.apps.googleusercontent.com">
        < Router >
        < Header />
        
              < SubMenu />
        <div className='d-flex bodySection'>
          
          < Sidemenu />
          <div className='d-flex flex-column col-sm-9 col-lg-10 col-12 mainContener'>
              < Main />
          </div>
        </div>
        <Login />
        </ Router >
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
