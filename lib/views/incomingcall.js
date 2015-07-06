module.exports = require('webrtc-core').bdsft.View(IncomingCallView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function IncomingCallView(incomingcall) {
  var self = {};

  self.model = incomingcall;
  
  self.elements = ['displayName', 'user', 'accept', 'reject', 'holdAndAccept', 'dropAndAccept'];

  self.listeners = function() {
    self.accept.on('click', function(e) {
      e.preventDefault();
      incomingcall.accept();
    });
    self.reject.on('click', function(e) {
      e.preventDefault();
      incomingcall.reject();
    });
    self.holdAndAccept.on('click', function(e) {
      e.preventDefault();
      incomingcall.holdAndAccept();
    });
    self.dropAndAccept.on('click', function(e) {
      e.preventDefault();
      incomingcall.dropAndAccept();
    });
  };

  return self;
}