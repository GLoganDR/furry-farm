/* jshint expr:true */
/* global it, describe, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Message   = require('../../app/models/message'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'furry-farm-test';

describe('Message', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Message object', function(){
      var senderId   = Mongo.ObjectID(),
          receiverId = Mongo.ObjectID(),
          body       = 'This is the text of the message',
          m          = new Message(senderId, receiverId, body);
      expect(m).to.be.instanceof(Message);
      expect(m.date).to.be.instanceof(Date);
      expect(m.senderId).to.be.instanceof(Mongo.ObjectID);
      expect(m.receiverId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('.messages', function(){
    it('should display messages for a given user', function(done){
      var u = '000000000000000000000002';
      Message.messages(u, function(err, messages){
        console.log('######', messages);
        expect(messages.length).to.equal(1);
        done();
      });
    });
  });





});//closing brackets

