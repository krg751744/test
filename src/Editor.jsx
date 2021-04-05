import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import { CKEditor } from '@ckeditor/ckeditor5-react';
// const CK = require('@ckeditor/ckeditor5-react/');
// const Classic = require('@ckeditor/ckeditor5-build-classic');
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
function Editor(props) {
 
  return (
    <CKEditor
    editor={ ClassicEditor }
    data={props.data}
    onReady={ (editor) => {
        // You can store the "editor" and use when it is needed.
        console.log( 'Editor is ready to use!', editor );
    } }
    onChange={ ( event, editor ) => {
        const data = editor.getData();
        props.update(data, "notes");
    } }
    onBlur={ ( event, editor ) => {
        console.log( 'Blur.', editor );
    } }
    onFocus={ ( event, editor ) => {
        console.log( 'Focus.', editor );
    } }
/>
  );
}

export default Editor;
