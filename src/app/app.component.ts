import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DbService } from './services/db.service';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private dbService: DbService, private accountService: AccountService) {
    // this.init();
  }

  init() {
    try {
      let user = JSON.parse(atob(localStorage.getItem('_user')));
      this.accountService.currentUser.next(user);
    } catch (error) {}
    this.dbService.initDB();
  }
}

