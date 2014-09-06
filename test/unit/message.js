/* jshint expr:true */
/* global describe, it, before, beforeEach */

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

  /*describe('.read', function(){
    it('should display a single message and mark it as read', function(done){
      Message.read('a00000000000000000000001', function(message){
        console.log('&&&&&&&', message);
        expect(message.isRead).to.be.true;
        done();
      });
    });
  });*/

  /*describe('.unread', function(){
    it('should display unread messages', function(done){
      var message = 'a00000000000000000000002'
      Messages.unread(u, function(err, message){
        console.log('^^^^^^^', message);
      });
    });
  });

  describe('iterator', function(){
    it
  });*/





});//closing brackets

