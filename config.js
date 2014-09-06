'use strict';

  var config = {};

config.twitter = {
  apiKey      : '2AMFYlJS4C5MXfm2MWRiIjLI4',
  apiSecret   : process.env.TWITTER_SECRET,
  callbackUrl : 'http://jessica-vm.com:3334/auth/twitter/callback'
};

config.google = {
  clientId      : '936106218408-rs6be7fr5ql6hnmj3ktqpigeojfeflmq.apps.googleusercontent.com',
  clientSecret  : process.env.GOOGLE_SECRET,
  callbackUrl   : 'http://jessica-vm.com:3334/auth/google/callback'
};

config.facebook = {
  clientId      : '792591384125995',
  clientSecret  : process.env.FACEBOOK_SECRET,
  callbackUrl   : 'http://jessica-vm.com:3334/auth/facebook/callback'
};

module.exports = config;
