/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
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

});//final closing
