'use strict';


var Mongo   = require('mongodb'),
    _       = require('underscore-contrib');

function Proposal(){
}

Object.defineProperty(Proposal, 'collection', {
  get: function(){return global.mongodb.collection('proposals');}
});

Proposal.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Proposal.collection.findOne({_id:_id}, function(err, obj){
    var user = Object.create(Proposal.prototype);
    user = _.extend(user, obj);
    cb(err, user);
  });
};

Proposal.find = function(userId, cb){
  var _id = Mongo.ObjectID(userId);
  Proposal.collection.find({receiverId: _id}).toArray(cb);
};


module.exports = Proposal;

