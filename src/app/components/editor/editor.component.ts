import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public editor: any;
  title = 'Untitled name';
  editMode: boolean = false;
  constructor() { }
  
  ngOnInit() {
    DecoupledEditor
    .create( document.querySelector( '.document-editor__editable' ), {
      cloudServices: {}
    } )
    .then(editor => {
        const toolbarContainer = document.querySelector( '.document-editor__toolbar' );
        toolbarContainer.appendChild( editor.ui.view.toolbar.element );
        this.editor = editor;
    })
    .catch(err => {
        console.error( err );
    });
  }
  text = `<p>Hello, world!</p>`;

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}
