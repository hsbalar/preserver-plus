import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { AccountService } from './account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(
    private accountService: AccountService,
    private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    if (this.accountService.user) {
      request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${this.accountService.user.token}:${this.accountService.user.password}`
        }
      });
    }
    return next.handle(request);
  }
}