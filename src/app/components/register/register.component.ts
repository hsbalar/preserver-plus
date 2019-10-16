import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { } from 'lodash';

import { NzMessageService } from 'ng-zorro-antd';
import { AccountService } from 'src/app/services/account.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  validateForm: FormGroup;
  loading: boolean = false;
  
  constructor(
    private router: Router,
    private dbService: DbService,
    private formBuilder: FormBuilder,
    private msgService: NzMessageService,
    private accountService: AccountService) {}

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid || this.loading) return;

    this.loading = true;
    this.accountService.register(this.validateForm.value)
      .subscribe((res: any) => {
        this.accountService.currentUser.next(res);
        localStorage.setItem('_user', btoa(JSON.stringify(res)));
        this.dbService.initRemoteDB();
        this.router.navigate(['/']);
        this.loading = false;
      }, err => {
        this.loading = false;
        if (err.error && err.error.validationErrors) {
          for (let key in err.error.validationErrors) {
            this.msgService.error(err.error.validationErrors[key][0]);
          }
        }
      });

  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.confirmPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };


  ngOnInit(): void {
    this.validateForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required, this.confirmationValidator]],
      username: [null, [Validators.required]],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      agree: [false]
    });
  }
  
}
