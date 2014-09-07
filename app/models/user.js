'use strict';

var bcrypt  = require('bcrypt'),
    Message = require('./message'),
    Mongo   = require('mongodb'),
    _       = require('underscore-contrib'),
    twilio  = require('twilio'),
    Mailgun = require('mailgun-js'),
    fs    = require('fs'),
    path  = require('path'),
    async   = require('async'),
    Proposal = require('./proposal');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.find = function(filter, cb){
  filter.isVisible = true;
  User.collection.find(filter).toArray(cb);
};

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
    o.loc = {};
    o.licks = [];
    o.wags = [];
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
    user = {twitterId:twitter.id, username:twitter.username, displayName:twitter.displayName, type:'twitter', licks:[], wags:[], loc: {}};
    User.collection.save(user, cb);
  });
};

User.googleAuthenticate = function(token, secret, google, cb){
  User.collection.findOne({googleId:google.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {googleId:google.id, username:google.displayName, type:'google', licks:[], wags:[], loc: {}};
    User.collection.save(user, cb);
  });
};

User.facebookAuthenticate = function(token, secret, facebook, cb){
  User.collection.findOne({facebookId:facebook.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {facebookId:facebook.id, username:facebook.username, type:'facebook', licks:[], wags:[], loc: {}};
    User.collection.save(user, cb);
  });
};

User.prototype.uploadPhoto = function(files, cb){
  var baseDir = __dirname + '/../static',
      relDir  = '/img/' + this._id,
      absDir  = baseDir + relDir,
      exist = fs.existsSync(absDir),
      oldIndex,
      self = this;

  if(!this.photos) { this.photos = []; }
  if(!exist){fs.mkdirSync(absDir);} //check to see if directory already exists

  var newPhotos = files.photos.map(function(photo, index){
    if(!photo.size){return;}

    //make sure there photos.length is even in existence
    if(self.photos.length){
      //set the index equal to the loop index + the self.photos.length
      oldIndex = index + (self.photos.length - 1);
    }
    else {
      oldIndex = index;
    }

    var ext      = path.extname(photo.path),
        name     = oldIndex + ext,
        absPath  = absDir + '/' + name,
        relPath  = relDir + '/' + name;

    fs.renameSync(photo.path, absPath);
    return relPath;
  });

  newPhotos = _.compact(newPhotos); //shorten the new photos
  this.photos = this.photos.concat(newPhotos); //add other old photos array with the new!

  User.collection.save(this, cb);
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
      sendText(receiver.phone, obj.body, cb);
      break;
    case 'email':
      sendEmail(this.email, receiver.email, obj.body, cb);
      break;
    case 'internal':
      Message.send(this._id, receiver._id, obj.body, cb);
  }
};

User.displayLicks = function(userId, cb){
  User.findById(userId, function(err, user){
    if(!user.licks) { return cb([]); }

    async.map(user.licks, function(lick, cb){
      User.findById(lick, function(err, u){
        cb(null, u);
      });
    }, function(err, licks){
      cb(licks);
    });
  });

};


User.displayProposals = function(userId, cb){
  Proposal.find(userId, function(err, proposals){
    if(!proposals.length) { return cb([]); }

    async.map(proposals, function(from, cb){
      User.findById(from.fromId, function(err, u){
        cb(null, u);
      });
    }, function(err, users){
      cb(proposals, users);
    });
  });

};

//NEEDS TESTING
User.propose = function(to, from, cb){
  var p = new Proposal();
  p.receiverId = to;
  p.fromId = from;

  Proposal.collection.save(p, cb);
};


//NEEDS TESTING
User.prototype.acceptProposal = function(fromId, proposalId, cb){
  var self = this;
  User.findById(fromId, function(err, user){
    var body = (user.username || user.email)  + ', ' + (self.username || 'a Furry Farm user') + ' has accepted your date proposal. Way to go!';
    txtMsg(user.phone, body, function(err, response){
      Proposal.collection.remove({_id: Mongo.ObjectID(proposalId)}, cb);
    });
  });
};

//NEEDS TESTING
User.prototype.declineProposal = function(fromId, proposalId, cb){
  var self = this;
  User.findById(fromId, function(err, user){
    var body = (user.username || user.email)  + ', ' + (self.username || 'a Furry Farm user') + ' has declined your date proposal. There is plenty of fish though. Don\'t give up!';
    txtMsg(user.phone, body, function(err, response){
      Proposal.collection.remove({_id: Mongo.ObjectID(proposalId)}, cb);
    });
  });
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

function sendEmail(from, to, message, cb){
  var mailgun = new Mailgun({apiKey:process.env.MGKEY, domain:process.env.MGDOM}),
      data    = {from:'admin@furryfarm.com', to:to, subject:'Subject: Hello From Furry Farm!', text:message};

  mailgun.messages().send(data, cb);
}

function txtMsg(to, body, cb){
  if(!to){return cb();}

  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
      from       = process.env.FROM,
      client     = require('twilio')(accountSid, authToken);

  client.messages.create({to:to, from:from, body:body}, cb);
}
