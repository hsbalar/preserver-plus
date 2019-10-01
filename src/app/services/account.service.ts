import { Injectable } from '@angular/core';
import { Subject, AsyncSubject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AUTH_BASE_URL, LOGIN, REGISTER, LOGOUT } from '../references/constant';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  isLoggedIn: ReplaySubject<boolean>;
  currentUser: Subject<any> = new BehaviorSubject<any>(null);
  user: any;
  edit: any;

  constructor(public router: Router, public http: HttpClient) {
    this.isLoggedIn = new ReplaySubject(1);
    this.currentUser.subscribe(res => {      
      this.user = res;
    });
  }

  public isAuthenticated(): boolean {
    return this.user ? true : false;
  }

  logout() {
    return this.http.post(`${AUTH_BASE_URL}${LOGOUT}`, {});
  }

  login(formData: any) {
    return this.http.post(`${AUTH_BASE_URL}${LOGIN}`, formData);
  }

  register(formData: any) {
    return this.http.post(`${AUTH_BASE_URL}${REGISTER}`, formData);
  }
}