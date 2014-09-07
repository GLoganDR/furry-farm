'use strict';

var bcrypt  = require('bcrypt'),
    Message = require('./message'),
    Mongo   = require('mongodb'),
    _       = require('underscore-contrib'),
    twilio  = require('twilio'),
    Mailgun = require('mailgun-js'),
    async   = require('async');

function User(){
}

User.find = function(filter, cb){
  filter.isVisible = true;
  User.collection.find(filter).toArray(cb);
};

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    var user = Object.create(User.prototype);
    user = _.extend(user, obj);
    cb(err, user);
  });
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    o.type = 'local';
    User.collection.save(o, cb);
  });
};

User.localAuthenticate = function(email, password, cb){
  User.collection.findOne({email:email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(password, user.password);
    if(!isOk){return cb();}
    cb(null, user);
  });
};

User.twitterAuthenticate = function(token, secret, twitter, cb){
  User.collection.findOne({twitterId:twitter.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {twitterId:twitter.id, username:twitter.username, displayName:twitter.displayName, type:'twitter'};
    User.collection.save(user, cb);
  });
};

User.googleAuthenticate = function(token, secret, google, cb){
  User.collection.findOne({googleId:google.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {googleId:google.id, username:google.displayName, type:'google'};
    User.collection.save(user, cb);
  });
};

User.facebookAuthenticate = function(token, secret, facebook, cb){
  User.collection.findOne({facebookId:facebook.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {facebookId:facebook.id, username:facebook.username, type:'facebook'};
    User.collection.save(user, cb);
  });
};

User.prototype.save = function(o, cb){
  var properties = Object.keys(o),
      self       = this;

  properties.forEach(function(property){
    switch(property){
      case 'visible':
        self.isVisible = o[property] === 'public';
        break;
      default:
        self[property] = o[property];
    }
  });

  User.collection.save(this, cb);
};

User.prototype.messages = function(cb){
  Message.messages(this._id, cb);
};

User.displayProfile = function(userId, cb){
  var _id = Mongo.ObjectID(userId);
  User.collection.findOne({_id: _id, isVisible: true}, function(err, user){
    if(!user){ return cb(err, user);}
    async.map(user.wags, userIterator, function(err, waggers){
      user.waggers = waggers;
      cb(err, user);
    });
  });
};

User.addWag = function(to, from, cb){
  var toId = Mongo.ObjectID(to);
  User.collection.findOne({_id: toId}, function(err, user){
    user.wags.push(from);
    user.wags = _.uniq(user.wags);
    User.collection.save(user, cb);
  });
};

User.addLick = function(lickedPerson, loggedInUser, cb){
  //loggedInUser already Mongo.ObjectID
  User.collection.findOne({_id: loggedInUser}, function(err, user){
    user.licks.push(lickedPerson);
    user.licks = _.uniq(user.licks);
    User.collection.save(user, cb);
  });
};

User.prototype.send = function(receiver, obj, cb){
  switch(obj.mtype){
    case 'text':
      sendText(receiver.phone, obj.message, cb);
      break;
    case 'email':
      sendEmail(this.email, receiver.email, obj.message, cb);
      break;
    case 'internal':
      Message.send(this._id, receiver._id, obj.message, cb);
  }
};

module.exports = User;

//Private Functions
function userIterator(userId, cb){
  var userList;
  User.findById(userId, function(err, user){
    userList = user;
    cb(null, userList);
  });
}

function sendText(to, body, cb){
  if(!to){return cb();}

  var accountSid  = process.env.TWSID,
      authToken   = process.env.TWTOK,
      from        = process.env.FROM,
      client      = twilio(accountSid, authToken);

  client.messages.create({to:to, from:from, body:body}, cb);
}

function sendEmail(from, to, subject, message, cb){
  var mailgun = new Mailgun({apiKey:process.env.MGKEY, domain:process.env.MGDOM}),
      data    = {from:from, to:to, subject:subject, text:message};

  mailgun.messages().send(data, cb);
}
