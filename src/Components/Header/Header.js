import './Header.css';
import { useSelector } from 'react-redux';
import ProfilHeader from './ProfilHeader';
import React, { useEffect, useContext } from 'react';
import { UIContext } from '../UIProvider';
import { displaySideMenu } from '../../ui/UIutils';
import Notifications from './Notifications';
import DarkModeButton from './DarkModeButton';
import Search from './Search';

export default function Header () {
    const user = useSelector(state => state.user);
    const {toggleDarkMode} = useContext(UIContext);

    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode){
            toggleDarkMode();
        }
      }, []);

    return (
        <header>
            <div className="headerMain w-100 d-flex align-items-center justify-content-around" >
                
                <div className='d-flex align-items-center h-100'>
                    <button className="burgerSideMenu" onClick={event => displaySideMenu(event)}>
                        <i className="fa-solid fa-bars fa-xl"></i>
                    </button>
                    <div className="d-flex flex-column align-items-center h-100 justify-content-center ms-lg-1 ms-sm-4">
                        <img src={ process.env.REACT_APP_URL_IMG + "logo.png"} alt="logo" className="logo"/>
                        <h1 className="logoTitle">
                            Clueless
                        </h1>
                    </div>
                    <div className='ms-lg-5 ms-3 d-flex align-items-center darkModeToggle'>
                        < DarkModeButton />
                    </div>
                </div>
                <div className="pt-xxl-2 pt-1 pb-1 pb-xxl-2 pe-1 d-flex searchElm">
                    < Search />
                </div>
                <div className='d-flex align-items-center'>
                    < Notifications user={user} />
                    {user.token ? 
                        < ProfilHeader  user={user.user} />
                         : 
                         <button className="buttonLogin" data-bs-toggle="modal" data-bs-target="#loginModal">
                            Se connecter
                        </button>
                    }
                </div>
            </div>
        </header>
    );
};