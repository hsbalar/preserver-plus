import { Component } from '@angular/core';
import { DbService } from './services/db.service';
import { AccountService } from './services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public router: Router,
    public dbService: DbService,
    public accountService: AccountService) {
    this.init();
  }

  init() {
    try {
      let user = JSON.parse(atob(localStorage.getItem('_user')));
      this.accountService.currentUser.next(user);
    } catch (error) {}
    this.dbService.initDB();
  }

  logout() {
    this.accountService.logout()
      .subscribe(() => {
        this.dbService.clearDatabase()
        .then(() => {
          this.dbService.initLocalDB();    
          this.accountService.currentUser.next(null);
          this.router.navigate(['/']);
          localStorage.clear();
          });
      });
  }
}

