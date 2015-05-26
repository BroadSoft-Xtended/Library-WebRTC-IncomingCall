module.exports = require('webrtc-core').bdsft.View(IncomingCallView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function IncomingCallView(eventbus, incomingcall) {
  var self = {};

  self.model = incomingcall;
  
  self.elements = ['displayName', 'user', 'acceptIncomingCall', 'rejectIncomingCall', 'holdAndAcceptButton', 'dropAndAcceptButton',
  'callPopup'];

  self.listeners = function() {
    self.acceptIncomingCall.on('click', function(e) {
      e.preventDefault();
      incomingcall.accept();
    });
    self.rejectIncomingCall.on('click', function(e) {
      e.preventDefault();
      incomingcall.reject();
    });
    self.holdAndAcceptButton.on('click', function(e) {
      e.preventDefault();
      incomingcall.holdAndAccept();
    });
    self.dropAndAcceptButton.on('click', function(e) {
      e.preventDefault();
      incomingcall.dropAndAccept();
    });
  };

  return self;
}