var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var superLogin = require('superlogin');

var app = express();
app.set('port', process.env.PORT || 4000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var config = {
  dbServer: {
    protocol: 'http://',
    host: 'localhost:5984',
    user: '',
    password: '',
    userDB: 'preserver-users',
    couchAuthDB: '_users'
  },
  mailer: {
    fromEmail: 'preserver.support@gmail.com',
    options: {
      service: 'Gmail',
        auth: {
          user: 'xxx.xxx@gmail.com',
          pass: 'userpass'
        }
    }
  },
  security: {
    maxFailedLogins: 3,
    lockoutTime: 600,
    tokenLife: 86400,
    loginOnRegistration: true,
  },
  userDBs: {
    defaultDBs: {
      private: ['preserver']
    },
    model: {
      preserver: {
        permissions: ['_reader', '_writer', '_replicator']
      }
    }
  },
  providers: { 
    local: true 
  },
  userModel: {
    whitelist: [
      'firstname',
      'lastname'
    ],
  }
}

// Initialize SuperLogin 
var superlogin = new superLogin(config);

// Mount SuperLogin's routes to our app 
app.use('/auth', superlogin.router);

app.listen(app.get('port'));
console.log("App listening on " + app.get('port'));