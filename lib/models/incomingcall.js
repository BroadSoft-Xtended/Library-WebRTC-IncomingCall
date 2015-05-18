module.exports = require('webrtc-core').bdsft.Model(IncomingCall)

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function IncomingCall(eventbus, sound, sipstack) {
  var self = {};

  self.props = ['incomingCallName', 'incomingCallUser', 'classes', 'visible'];

  self.bindings = {
    'classes': {
        incomingcall: 'visible',
        sipstack: 'callState'
    }
  }

  var incomingSession;

  var handle = function(){
    eventbus.toggleView(Constants.VIEW_INCOMINGCALL, false);
    sound.pause();
  };

  self.accept = function() {
    handle();
    sipstack.answer(incomingSession)
  };

  self.dropAndAnswer = function() {
    handle();
    sipstack.terminateSession();
    sipstack.answer(incomingSession);
  };

  self.holdAndAnswer = function() {
    handle();
    sipstack.holdAndAnswer(incomingSession);
  };

  self.reject = function() {
    handle();
    sipstack.terminateSession(incomingSession);
  };

  self.listeners = function() {
    eventbus.on("canceled", function(e) {
      self.visible = false;
    });

    eventbus.on("incomingCall", function(evt) {
      incomingSession = evt.data.session
      var from = evt.data && evt.data.request && evt.data.request.from || {};
      eventbus.message("Incoming Call", "success");
      self.incomingCallName = from.display_name || '';
      self.incomingCallUser = from.uri && from.uri.user || '';
      self.visible = true;
      sound.playRingtone();
    });
  };

  return self;
}