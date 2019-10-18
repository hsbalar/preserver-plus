import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AccountService } from './account.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable((observer: Observer<boolean>) => {
      const isAuthenticated = this.accountService.isAuthenticated();
      if (isAuthenticated) {
        // authenticated, redirect to home
        this.router.navigate(['/']);
      }
      observer.next(!isAuthenticated);
      observer.complete();
    });
  }
}
