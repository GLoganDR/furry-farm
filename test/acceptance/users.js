/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'furry-farm-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /register', function(){
    it('should show the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('get /farm/user/:id', function(){
    it('should show a owner profile', function(done){
      request(app)
      .get('/farm/users/000000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should not show a private user\'s profile', function(done){
      request(app)
      .get('/farm/users/000000000000000000000002')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });

    it('should show a public user\'s profile', function(done){
      request(app)
      .get('/farm/users/000000000000000000000003')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('get /auth/twitter', function(){
    it('should take user to the home page', function(done){
      request(app)
      .get('/auth/twitter')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /auth/twitter/callback', function(){
    it('should take user to the home page', function(done){
      request(app)
      .get('/auth/twitter/callback')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /auth/facebook', function(){
    it('should take user to the home page', function(done){
      request(app)
      .get('/auth/facebook')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /auth/facebook/callback', function(){
    it('should take user to the home page', function(done){
      request(app)
      .get('/auth/facebook/callback')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /auth/google', function(){
    it('should take user to the home page', function(done){
      request(app)
      .get('/auth/google')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /auth/google/callback', function(){
    it('should take user to the home page', function(done){
      request(app)
      .get('/auth/google/callback')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /messages', function(){
    it('should take the user to the messages page', function(done){
      request(app)
      .get('/messages')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('get /messages/:msgId', function(){
    it('should take the user to the messages page', function(done){
      request(app)
      .get('/messages/a00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('post /user/:toId/wag', function(){
    it('should should add a wag to someones profile', function(done){
      request(app)
      .post('/user/000000000000000000000003/wag')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /user/:lick/lick', function(){
    it('should should add favorite to someones list', function(done){
      request(app)
      .post('/user/000000000000000000000003/lick')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

});//closing bracket


