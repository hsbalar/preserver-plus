# Preserver Plus
___

Minimal notes app with rich text formatting.
___

## What it is behind the app ?

This app is built using `Angular` platform with `PouchDB` to storing your local data on browser and `CouchDB` to sync notes with your account.
  - That's part of fun setting up a bi-directional and continuous replication, so as soon as we make a change to our local data it will be reflected in the remote database, and as soon as we make a change to the remote data it will be replicated in the local data. So wherever your have logged in will sync up with immediatly.
  - :memo: To create a note `CKEditor5` document editor is configured.
  - :book: For listing down all notes in dashboard I've used `Angular2gridster` which helps to provide easy configurable and manageable grid layout.
  - :sunrise_over_mountains: And last thing `Ant Design` for Angular is a set of high quality components and rich, interactive user interfaces.
  - :no_mouth: Opps... wait what about authentication & signup yeahh the core part, don't forget :point_right: For that I've used `Superlogin` package a Powerful authentication for APIs and single page apps using the CouchDB.
  - We just need to setup `NodeJS` server, all big task like creation of private db for user, registration, authentication, logout, forgot password many more... all will be taken care by superlogin, We just need to make express instance up & running with couchdb configurations. 
  - Cool... I think I'm done :sunglasses:.
  - One more thing It's `PWA`, a service worker is a script that runs in the web browser and manages caching for an application. Done not much... :speak_no_evil: ...

## Key Features

* Rich text editor.
* Online/Offline sync with your account.
* WYSIWYG notes.
* Syntax highlighting.
* Toolbar for text formatting.
* Local db and Remote db.
* PWA (Progressive web app).

## Running the app locally

```bash
# Clone repo
$ git clone https://github.com/hsbalar/preserver-plus.git

# Go into this repository
$ cd preserver-plus

# Install dependencies
$ npm install

# Run the app
$ npm start
```
Angular app will be listen on `localhost:4200`.

## Running node server

```bash
# Go into this repository
$ cd server/

# Install dependencies
$ npm install

# Run the app
$ npm start
```
Node server will be listen on `localhost:4000`.
###### Note: You should have pouchdb installed and instance running on `localhost:5984` to sync up local pouchdb to central couchdb.

## Deployed on

- This app is deployed on [Netlify](https://www.netlify.com/).
- Auth server deployed on [Heroku](https://www.heroku.com/).
- Source is here.

## Roadmap

* [-] To do multiple dashboard.
* [-] To do miltuple notes editable.
* [-] To Preserve position of notes in dashboard.
* [-] To have vertical & horizontal scroll layout in dashboard.
* [-] To download notes.
* [-] To do more.

## License

MIT

---

> [hiteshbalar.com](https://www.hiteshbalar.com) &nbsp;&middot;&nbsp;
> GitHub [@hsbalar](https://github.com/hsbalar) &nbsp;&middot;&nbsp;
> Twitter [@hsbalar](https://twitter.com/hsbalar) &nbsp;&middot;&nbsp;
> Instagram [@hsbalar](https://www.instagram.com/hsbalar) &nbsp;&middot;&nbsp;


