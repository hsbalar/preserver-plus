import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { AccountService } from './account.service';
import { BehaviorSubject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  public db: any;
  public remoteDb: any;
  public sync: boolean = false;
  public list: any = [];
  public updatedList = new BehaviorSubject([]);
  public notificationId = null;

  constructor(
    private message: NzMessageService,
    private accountService: AccountService) {}

  initDB() {    
    if (this.accountService.user)
      this.initRemoteDB();
    else
      this.initLocalDB();
  }

  initLocalDB() {
    console.log('local db initilize..');
    this.db = new PouchDB('local-preserver');
    this.getList();
  }

  initRemoteDB() {
    console.log('remote db initilize..');
    this.db = new PouchDB('preserver');
    this.remoteDb = this.accountService.user.userDBs.preserver;

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remoteDb, options);
    this.sync = true;
    this.showLoadingNotification();
    setTimeout(() => {
      this.getList();
    }, 1000);
  }

  clearDatabase() {
    return this.db.destroy().then(() => {
      console.log("remote db removed..");
    });
  }

  getList() {
    this.db.allDocs({
      include_docs: true
    }).then((result: any) => {
      this.list = [];
      let docs = result.rows.map((row) => {
        this.list.push(row.doc);
      });
      this.sync = false;
      this.removeLoadingNotification();   
      this.updatedList.next(this.list);
      this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', (change: any) => {
        this.handleChange(change);
      });
    }).catch((error) => {
      console.log(error);
    });    
  }

  getById(id: any) {
    return this.db.get(id);
  }

  search(searchTerm: string) {
    return this.db.find()
  }

  save(note: any) {
    return this.db.post(note);
  }

  delete(note: any) {
    return this.db.remove(note);
  }

  update(note: any) {
    return this.db.put(note);
  }

  handleChange(change) {
    const changedIndex = this.list.findIndex((doc) => doc._id === change.id);
    if (change.deleted) {
      this.list.splice(changedIndex, 1);
    }
    else {
      if (changedIndex >= 0) {
        this.list[changedIndex] = change.doc;
      }
      else {
        this.list.push(change.doc);
      }
    }
    setTimeout(() => this.sync = false, 50);
    this.updatedList.next(this.list);
  }

  showLoadingNotification() {
    this.notificationId = this.message.loading('Initializing notes...', { nzDuration: 0 }).messageId;
  }
  
  removeLoadingNotification() {
    this.message.remove(this.notificationId);
  }
}
