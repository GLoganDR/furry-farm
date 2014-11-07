'use strict';

  var config = {};

config.twitter = {
  apiKey      : 'r2pzcfBLTAl5O5M278akBdSk',
  apiSecret   : process.env.TWITTER_SECRET,
  callbackUrl : 'http://172.31.37.69:3334/auth/twitter/callback'
};

config.google = {
  clientId      : '1087279288457-938rv5vlkeos3vfan60op2plv41b5kr9.apps.googleusercontent.com',
  clientSecret  : process.env.GOOGLE_SECRET,
  callbackUrl   : 'http://172.31.37.69:3334/auth/google/callback'
};

config.facebook = {
  clientId      : '297151127134724',
  clientSecret  : process.env.FACEBOOK_SECRET,
  callbackUrl   : 'http://172.31.37.69:3334/auth/facebook/callback'
};

config.stripe = {
  publishKey : process.env.STRIPE_PUBLISH,
  secretKey  : process.env.STRIPE_SECRET
};

module.exports = config;
