import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { AccountService } from './account.service';
import { isEmpty } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  public db: any;
  public remoteDb: any;
  public list: any = [];

  constructor(private accountService: AccountService) {}

  initDB() {
    if (this.accountService.user)
      this.initRemoteDB();
    else
      this.initLocalDB();
  }

  initLocalDB() {
    console.log('local db initilize..');
    this.db = new PouchDB('local-preserver');
  }

  initRemoteDB() {
    console.log('remote db initilize..');
    this.db = new PouchDB('preserver');
    this.remoteDb = this.accountService.user.userDBs.bb;

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remoteDb, options);

    this.getList();
  }

  clearDatabase() {
    this.db.destroy().then(() => {
      console.log("remote db removed..");
    });
  }

  getList() {
    if (!isEmpty(this.list)) {
      return Promise.resolve(this.list);
    }

    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true
      }).then((result) => {
        this.list = [];
        let docs = result.rows.map((row) => {
          this.list.push(row.doc);
        });
        this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
          this.handleChange(change);
        });
      }).catch((error) => {
        console.log(error);
      });
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
    let changedDoc = null;
    let changedIndex = null;
    this.list.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    if (change.deleted) {
      this.list.splice(changedIndex, 1);
    }
    else {
      if (changedDoc) {
        this.list[changedIndex] = change.doc;
      }
      else {
        this.list.push(change.doc);
      }
    }
  }

  stripHtml(html: string) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
}