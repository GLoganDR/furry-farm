/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    Mongo     = require('mongodb'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'furry-farm-test';

describe('User', function(){
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

  describe('.find', function(){
    it('should find users who are public', function(done){
      User.find({isVisible:true}, function(err, users){
        expect(users).to.have.length(2);
        done();
      });
    });
  });

  describe('.displayProfile', function(){
    it('should display a public-only profile', function(done){
      var c = '000000000000000000000001';
      User.displayProfile(c, function(err, user){
        expect(user.isVisible).to.be.true;
        expect(user).to.be.ok;
        done();
      });
    });
  });

  describe('#save', function(){
    it('should save a user', function(done){
      var u = new User(),
      o = {x:3, visible:'public', foo:'bar'};

      u.baz = 'bim';
      u.save(o, function(err, user){
        expect(user.isVisible).to.be.true;
        expect(user.foo).to.equal('bar');
        expect(user.baz).to.equal('bim');
        done();
      });
    });
  });

  describe('#messages', function(){
    it('should display messages for a given user', function(done){
      var u = new User();
      u._id = '000000000000000000000001';
      u.messages(function(err, messages){
        expect(messages.length).to.equal(2);
        done();
      });
    });
  });

  describe('#send', function(){
    it('should send a text message to a user', function(done){
      User.findById('000000000000000000000001', function(err, sender){
        User.findById('000000000000000000000002', function(err, receiver){
          sender.send(receiver, {mtype:'text', body:'hello'}, function(err, response){
            expect(response.sid).to.be.ok;
            done();
          });
        });
      });
    });

    it('should send an email message to a user', function(done){
      User.findById('000000000000000000000001', function(err, sender){
        User.findById('000000000000000000000002', function(err, receiver){
          sender.send(receiver, {mtype:'email', body:'hello'}, function(err, response){
            expect(response.id).to.be.ok;
            done();
          });
        });
      });
    });

    it('should send an internal message to a user', function(done){
      User.findById('000000000000000000000001', function(err, sender){
        User.findById('000000000000000000000002', function(err, receiver){
          sender.send(receiver, {mtype:'internal', body:'hello'}, function(err, response){
            expect(response).to.be.ok;
            done();
          });
        });
      });
    });
  });
  describe('.displayLicks', function(){
    it('should should display licks for the lick page', function(done){
      var u = new User();
      u._id = '000000000000000000000001';

      User.displayLicks(u._id, function(licks){
        expect(licks).to.have.length(1);
        done();
      });
    });
  });

  describe('.displayProposals', function(){
    it('should display proposals on the licks page', function(done){
      var u = new User();
      u._id = '000000000000000000000001';

      User.displayProposals(u._id, function(proposals){
        expect(proposals).to.have.length(2);
        done();
      });
    });
  });

  describe('.propose', function(){
    it('should create a new proposal', function(done){
      var u = new User();
      u._id = '000000000000000000000001';

      User.propose('000000000000000000000003', u._id, function(err, proposal){
        expect(proposal._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });


});//final closing
