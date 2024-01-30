import '../App.css';
import Header from './Header';
import Sidemenu from './Sidemenu';
import SubMenu from './Submenu';
import Main from './Main';
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadCategory} from '../features/category/categorySlice';
import { loadQuestions, emptyQuestions} from '../features/question/questionSlice';
import { fetchData } from '../api/APIutils';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
      fetchData('categories', 'GET', loadCategoryData);     
      fetchData('questions?page=1', 'GET', loadData);
    }, []);

      function loadData(data){
        dispatch(emptyQuestions());
        for (let question of data["hydra:member"]){
            dispatch(loadQuestions(question));
        } 
      }

      function loadCategoryData(data) {
        for (let categorie of data["hydra:member"]){
          dispatch(loadCategory(categorie));
        }
      }

  return (
    <div className="App vh-100">
      < Router >
      < Header />
      
      <div className='d-flex'>
        
        < Sidemenu />
        <div className='d-flex flex-column w-100 '>
            < SubMenu />
            < Main />
        </div>
      </div>
      </ Router >
    </div>
  );
}

export default App;
