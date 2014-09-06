'use strict';

  var config = {};

config.twitter = {
  apiKey      : '2AMFYlJS4C5MXfm2MWRiIjLI4',
  apiSecret   : 'HPJ0wL9mXtXtOm3Saa3g2NFQMevCdHE0F4UNkw9lB0mkH653jc',
  callbackUrl : 'http://jessica-vm.com:3334/auth/twitter/callback'
};

config.google = {
  clientId      : '936106218408-rs6be7fr5ql6hnmj3ktqpigeojfeflmq.apps.googleusercontent.com',
  clientSecret  : 'Es7ZejJCzpbee7tow8i3kp5i',
  callbackUrl   : 'http://jessica-vm.com:3334/auth/google/callback'
};

config.facebook = {
  clientId      : '792591384125995',
  clientSecret  : '8fa1b5ceadefeab70a94fb49f0c1cb9f',
  callbackUrl   : 'http://jessica-vm.com:3334/auth/facebook/callback'
};

module.exports = config;
