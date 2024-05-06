import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function TextArea(props) {

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

    
  return (
      <div id = {props.id} className={`pb-5 mb-3 mt-3 textEditor w-100 ${props.class}`}>
        <ReactQuill
          style={{ height: '150px', width: '100%' }}
          defaultValue={props.content}
          onChange={props.setContent}
          modules={modules}
          formats={formats}
          placeholder={ props.class === 'answer' ? 'Écrire une réponse' : 'Écrire un commentaire'}
        />
      </div>
  );
}