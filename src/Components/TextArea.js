import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../api/APIutils';
import { loadQuestion } from '../features/question/questionSlice';

function TextArea(props) {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const user = useSelector(state => state.user);

  const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, false] }],
        ['blockquote', 'code-block'],
        ['bold', 'italic', 'underline', 'strike'],
        ['link', ],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean'],
      ],
    };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'link',
    'list', 'bullet',
  ];


  function loadAnswerData(data) {
    let editors = document.querySelectorAll('.textEditor');
    for (let editor of editors) {
      editor.classList.add('d-none');
    }
    fetchData('questions/' + props.idQuestion, 'GET', loadQuestionData )
  }

  function loadQuestionData(data) {
    dispatch(loadQuestion(data));
  }

  function writeAnswer(){
    const data = {
      content: text,
      user: `/api/users/9${user.user.user_id}`, 
      question: `/api/questions/${props.idQuestion}`
    };

    if (document.getElementBydId('questionAnswer')) {
      fetchData('answers', 'POST', loadAnswerData, user.JWBToken.token, data);
    }
    else if (document.getElementBydId('questionComment')) {
      fetchData('comments', 'POST', loadAnswerData, user.JWBToken.token, data);
    }
  }
    
      return (
        <div className='d-flex flex-column align-items-center'>
          <div id = {props.id} className='pb-5 mb-3 mt-3 textEditor w-100'>
            <ReactQuill
              style={{ height: '150px' }}
              value={text}
              onChange={setText}
              modules={modules}
              formats={formats}
              placeholder={ props.id === 'questionAnswer' ? 'Écrire une réponse' : 'Écrire un commentaire'}
            />
          </div>
          <button onClick={event => writeAnswer()}>
            Envoyer
          </button>
        </div>
        
      );
}

export default TextArea;