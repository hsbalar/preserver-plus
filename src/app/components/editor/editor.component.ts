import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  debounce,
  map,
} from 'rxjs/operators';

import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DbService } from 'src/app/services/db.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  public editor: any = DecoupledEditor;
  public editMode: boolean = false;
  public form: FormGroup;
  public isSaving: string = null;

  @ViewChild('editTitle', { read: ElementRef, static: true })
  public titleEle: ElementRef;

  constructor(
    public cd: ChangeDetectorRef,
    public accountService: AccountService,
    public dbService: DbService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();

    this.form.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((formData) => {
        console.log('form changes...');
        this.saveChanges();
      });

    if (this.accountService.edit && this.accountService.edit._id) {
      this.patchFormData(this.accountService.edit);
    }
  }

  onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    editor.editing.view.focus();
    editor.config.forcePasteAsPlainText = true;
  }

  saveChanges() {
    this.isSaving = 'true';
    this.dbService.save(this.form.value).then((res: any) => {
      this.form.get('_id').setValue(res.id, { emitEvent: false });
      this.form.get('_rev').setValue(res.rev, { emitEvent: false });
      setTimeout(() => (this.isSaving = 'false'), 800);
    });
  }

  patchFormData(data: any = {}) {
    this.form
      .get('_id')
      .setValue(data._id || null, { onlySelf: true, emitEvent: false });
    this.form
      .get('_rev')
      .setValue(data._rev || null, { onlySelf: true, emitEvent: false });
    this.form
      .get('title')
      .setValue(data.title || 'Untitled Name', {
        onlySelf: true,
        emitEvent: false,
      });
    this.form
      .get('content')
      .setValue(data.content || '', { onlySelf: true, emitEvent: false });
  }

  initForm() {
    this.form = this.formBuilder.group({
      _id: null,
      _rev: null,
      title: ['Untitled Name'],
      content: [''],
    });
  }

  onBlurTitle(e: Event) {
    this.editMode = false;
    if (!this.form.get('title').value.trim()) {
      this.form.get('title').setValue('Untitled Name');
    }
  }

  editTitleClick() {
    this.editMode = true;
  }

  newNoteClick() {
    this.accountService.edit = null;
    this.patchFormData();
  }
}
