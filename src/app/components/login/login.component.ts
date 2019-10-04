import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;
  error: boolean = false;
  loading: boolean = false;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid) return;
    this.loading = true;
    this.accountService.login(this.validateForm.value)
      .subscribe((res: any) => {
        this.accountService.currentUser.next(res);
        localStorage.setItem('_user', btoa(JSON.stringify(res)));
        this.dbService.initRemoteDB();
        this.router.navigate(['/']);
        this.loading = false;
      }, err => {
        this.error = true;
        this.loading = false;
        this.msgService.error(err.error.message);
      });
  }

  constructor(
    private fb: FormBuilder,
    private dbService: DbService,
    private accountService: AccountService,
    private msgService: NzMessageService,
    private router: Router) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
