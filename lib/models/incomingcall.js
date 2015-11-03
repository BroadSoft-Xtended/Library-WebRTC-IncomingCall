module.exports = require('bdsft-sdk-model')(IncomingCall)

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function IncomingCall(eventbus, sound, sipstack, urlconfig) {
  var self = {};

  self.props = ['displayName', 'user', 'classes', 'visible', 'hasRemoteVideo'];

  self.bindings = {
    'classes': {
        incomingcall: ['visible', 'hasRemoteVideo'],
        sipstack: ['callState', 'failed', 'sendVideo', 'receiveVideo']
    }
  }

  var incomingSession;

  var handle = function(){
    self.hide();
    sound.pause();
  };

  self.accept = function() {
    handle();
    sipstack.sendAudio = true;
    sipstack.sendVideo = true;
    sipstack.receiveVideo = true;
    sipstack.answer(incomingSession)
  };

  self.acceptAudio = function() {
    handle();
    sipstack.sendAudio = true;
    sipstack.sendVideo = false;
    sipstack.receiveVideo = false;
    sipstack.answer(incomingSession)
  };

  self.dropAndAccept = function() {
    handle();
    sipstack.terminateSession();
    sipstack.answer(incomingSession);
  };

  self.holdAndAccept = function() {
    handle();
    sipstack.holdAndAccept(incomingSession);
  };

  self.reject = function() {
    handle();
    sipstack.terminateSession(incomingSession);
  };

  self.listeners = function() {
    eventbus.on("incomingCall", function(evt) {
      incomingSession = evt.data.session;
      self.hasRemoteVideo = incomingSession.hasRemoteVideo();
      var from = evt.data && evt.data.request && evt.data.request.from || {};
      self.displayName = from.display_name || '';
      self.user = from.uri && from.uri.user || '';
      self.show();
      sound.playRingtone();
    });
  };

  return self;
}