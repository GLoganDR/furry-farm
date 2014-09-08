'use strict';

var User    = require('../models/user'),
    moment  = require('moment'),
    mp      = require('multiparty'),
    Message = require('../models/message');


exports.new = function(req, res){
  res.render('users/new');
};

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.logout();
  //req.flash('T.T.F.N');
  res.redirect('/');
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};
exports.contact = function(req, res){
  res.render('users/contact', {receiver: req.params.toId});
};

exports.edit = function(req, res){
  res.render('users/edit');
};

exports.uploadPhoto = function(req, res){
  User.findById(req.user._id.toString(), function(err, user){
    var form = new mp.Form();
    form.parse(req, function(err, fields, files){
      user.uploadPhoto(files, function(){
        res.redirect('/users/edit');
      });
    });
  });
};

exports.update = function(req, res){
  res.locals.user.save(req.body, function(){
    res.redirect('/farm/users/' + res.locals.user._id);
  });
};

exports.messages = function(req, res){
  req.user.messages(function(err, messages, senders){
    res.render('users/messages', {messages:messages, moment:moment, senders: senders});
  });
};

exports.message = function(req, res){
  Message.read(req.params.msgId, function(err, message){
    res.render('users/message', {message:message, moment:moment});
  });
};

exports.send = function(req, res){
  User.findById(req.params.toId, function(err, receiver){
    req.user.send(receiver, req.body, function(){
      res.redirect('/messages');
    });
  });
};

exports.displayProfile = function(req, res){
  User.displayProfile(req.params.userId, function(err, user){
    if(!user) {
      req.flash('error', 'No user found or profile is private.');
      res.redirect('/');
    }
    else if(user._id.toString() === req.user._id.toString()){
      res.render('users/owner-page', {waggers: user.waggers || []});
    }
    else {
      res.render('users/public-page', {publicUser: user});
    }
  });
};

exports.wag = function(req, res){
  User.addWag(req.params.toId, req.user._id, function(err, savedItem){
    req.flash('success', 'You wagged at someone!');
    res.redirect('/farm/users/' + req.params.toId);
  });
};

exports.lick = function(req, res){
  User.addLick(req.params.lickee, req.user._id, function(err, savedItem){
    req.flash('success', 'You licked someone! View them in your favorites.');
    res.redirect('/farm/users/' + req.params.lickee);
  });
};

exports.browse = function(req, res){
  var filter = req.query || {isVisible:true};
  User.find(filter, function(err, users){
    res.render('users/browse', {users:users});
  });
};

exports.congrats = function(req, res){
  res.render('users/congrats');
};

exports.lickIndex = function(req, res){
  User.displayLicks(req.user._id, function(licks){
    User.displayProposals(req.user._id, function(proposals, users){
      res.render('users/licks', {licks: licks, proposals: proposals, users: users});
    });
  });
};

exports.propose = function(req, res){
  User.propose(req.params.lickeeId, req.user._id, function(){
    res.redirect('/user/licks');
  });
};

exports.acceptProposal = function(req, res){
  req.user.acceptProposal(req.params.fromId, req.body.proposalId, function(){
    res.redirect('/user/licks');
  });
};

exports.declineProposal = function(req, res){
  req.user.declineProposal(req.params.fromId, req.body.proposalId, function(){
    res.redirect('/user/licks');
  });
};

exports.changePhoto = function(req, res){
  req.user.changePhoto(req.params.index, function(){
    res.redirect('/users/edit');
  });
};


