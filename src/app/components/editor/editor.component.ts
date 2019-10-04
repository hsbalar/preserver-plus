import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public editor: any = DecoupledEditor;
  public editMode: boolean = false;
  public form: FormGroup;
  @ViewChild('editTitle', { static: true }) titleEle: ElementRef;

  constructor(
    public cd: ChangeDetectorRef,
    public dbService: DbService,
    public formBuilder: FormBuilder) { }
  
  ngOnInit() {
    this.initForm();

    this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(formData => {
      console.log("form changes...");
      this.saveChanges()
    });
  }

  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  saveChanges() {
    this.dbService.save(this.form.value)
      .then((res: any) => {
        this.form.get('_id').setValue(res.id, {emitEvent: false});
        this.form.get('_rev').setValue(res.rev, {emitEvent: false});
      });
  }

  initForm() {
    this.form = this.formBuilder.group({
      _id: null,
      _rev: null,
      title: ['Unitited name', Validators.required], 
      content: ['', Validators.required]
    });
  }

  editTitleClick() {
    this.editMode = true;
    
    setTimeout(() => {
      this.titleEle.nativeElement.focus();
    }, 0);
  }
}
