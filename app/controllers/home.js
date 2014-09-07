'use strict';

exports.index = function(req, res){
  res.render('home/index');
};

exports.faq = function(req, res){
  res.render('home/faqs');
};

exports.contact = function(req, res){
  res.render('home/contact');
};

exports.about = function(req, res){
  res.render('home/about');
};
