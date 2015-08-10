test = require('../node_modules/webrtc-sipstack/test/includes/common')(require('../node_modules/webrtc-core/test/includes/common'));
describe('incomingcall', function() {

  before(function(){
    core = require('webrtc-core');
    test.createModelAndView('sipstack', {
      sipstack: require('webrtc-sipstack')
    });
    test.createModelAndView('incomingcall', {
      incomingcall: require('../'),
      sipstack: require('webrtc-sipstack'),
      sound: require('webrtc-sound')
    });
    eventbus = bdsft_client_instances.test.eventbus;
  });
  afterEach(function(){
    incomingcall.reject();
    test.endCall();
  });

  it('1st incoming call:', function() {
    sipstack.enableAutoAnswer = false;
    test.connect();
    var session = test.incomingSession();
    var answerOptions = "";
    session.answer = function(options) {
      answerOptions = options;
    }
    session.hasRemoteVideo = function(){ return true; }
    test.incomingCall(session);
    expect(answerOptions).toEqual("", "Answer should not have been called");
    expect(incomingcallview.displayName.text()).toEqual("Incoming DisplayName");
    expect(incomingcallview.user.text()).toEqual("Incoming User");
    expect(incomingcall.visible).toEqual(true);
    test.isVisible(incomingcallview.view.find('.callPopup'), true);
    expect(incomingcallview.dropAndAccept.css('display')).toEqual('none');
    expect(incomingcallview.holdAndAccept.css('display')).toEqual('none');
    test.equalCss(incomingcallview.acceptAudio, 'display', 'block');
    test.equalCss(incomingcallview.accept, 'display', 'block');
  });

  it('incoming call and cancel', function() {
    sipstack.enableAutoAnswer = false;
    test.connect();
    var session = test.incomingSession();
    var answerOptions = "";
    session.answer = function(options) {
      answerOptions = options;
    }
    test.incomingCall(session);
    expect(answerOptions).toEqual("", "Answer should NOT have been called");
    test.isVisible(incomingcallview.view.find('.callPopup'), true);
    session.failed('remote', null, 'Canceled');
    test.isVisible(incomingcallview.view.find('.callPopup'), false);
  });

  // it('1st incoming call with enableAutoAnswer', function() {
  //   sipstack.enableAutoAnswer = true;
  //   test.connect();
  //   var session = test.incomingSession();
  //   var answerOptions = "";
  //   session.answer = function(options) {
  //     answerOptions = options;
  //   }
  //   test.isVisible(incomingcallview.callPopup, false);
  //   test.incomingCall(session);
  //   expect(answerOptions).toNotEqual("", "Answer should have been called");
  //   test.isVisible(incomingcallview.callPopup, false);
  // });

  // it('2nd incoming call with enableAutoAnswer', function() {
  //   sipstack.enableAutoAnswer = true;
  //   test.connect();
  //   test.startCall();
  //   var session = test.incomingSession();
  //   var answerOptions = "";
  //   session.answer = function(options) {
  //     answerOptions = options;
  //   }
  //   test.incomingCall(session);
  //   expect(answerOptions).toEqual("", "Answer should not have been called");
  //   expect(incomingcallview.incomingCallName.text()).toEqual("Incoming DisplayName");
  //   expect(incomingcallview.incomingCallUser.text()).toEqual("Incoming User");
  //   test.isVisible(incomingcallview.callPopup, true);
  //   test.isVisible(incomingcallview.dropAndAccept, true);
  //   test.isVisible(incomingcallview.holdAndAccept, true);
  //   test.isVisible(incomingcallview.accept, false);
  // });

  it('2nd incoming call and hold and answer click', function() {
    sipstack.enableAutoAnswer = true;
    test.connect();
    var outgoingSession = test.outgoingSession();
    test.startCall(outgoingSession);
    var incomingSession = test.incomingSession();
    var answerOptions = "";
    incomingSession.answer = function(options) {
      answerOptions = options;
      incomingSession.started('local');
    }
    test.incomingCall(incomingSession);

    expect(sipstack.activeSession === outgoingSession).toEqual(true, "Outgoing session should be active");
    expect(sipstack.sessions.length).toEqual( 2);
    incomingcallview.holdAndAccept.trigger("click");
    expect(sipstack.activeSession === incomingSession).toEqual(true, "Incoming session should be active");
    expect(sipstack.sessions.length).toEqual( 2);
    expect(answerOptions).toNotEqual("", "Answer should have been called");
  });

  it('2nd incoming call and hold and answer click and resume 1st call after 2nd ends', function() {
    sipstack.enableAutoAnswer = true;
    test.connect();
    var outgoingSession = test.outgoingSession();
    test.startCall(outgoingSession);
    var incomingSession = test.incomingSession();
    test.incomingCall(incomingSession);

    incomingcallview.holdAndAccept.trigger("click");
    expect(sipstack.activeSession === incomingSession).toEqual(true, "Incoming session should be active");
    eventbus.endCall();
    expect(sipstack.activeSession === outgoingSession).toEqual(true, "Outgoing session should be active again");
    expect(sipstack.sessions.length).toEqual(1);
  });

  it('2nd incoming call and drop and answer click', function() {
    sipstack.enableAutoAnswer = true;
    test.connect();
    var outgoingSession = test.outgoingSession();
    test.startCall(outgoingSession);
    var incomingSession = test.incomingSession();
    incomingSession.answer = function(options) {
      answerOptions = options;
      incomingSession.started('local');
    }
    test.incomingCall(incomingSession);

    expect(sipstack.activeSession === outgoingSession).toEqual(true, "Outgoing session should be active");
    expect(sipstack.sessions.length).toEqual( 2);
    incomingcallview.dropAndAccept.trigger("click");
    expect(sipstack.activeSession === incomingSession).toEqual(true, "Incoming session should be active");
    expect(sipstack.sessions.length).toEqual( 1);
    expect(answerOptions).toNotEqual("", "Answer should have been called");
  });

  it('call and hangup and incoming call', function() {
    sipstack.enableAutoAnswer = false;
    test.connect();
    test.startCall();
    test.endCall();
    test.incomingCall();
    test.isVisible(incomingcallview.view.find('.callPopup'), true);
    expect(incomingcallview.dropAndAccept.css('display')).toEqual('none');
    expect(incomingcallview.holdAndAccept.css('display')).toEqual('none');
    expect(incomingcallview.accept.css('display')).toEqual('block');
  });
  it('window.onbeforeunload', function() {
    test.connect();
    var session = test.incomingSession();
    var terminated = false;
    session.terminate = function(options) {
      terminated = true;
    }
    test.incomingCall(session);
    window.onbeforeunload();
    expect(terminated).toEqual(true, "Should terminate the incoming session");
  });

  it('audio only incoming call', function() {
    test.connect();
    var session = test.incomingSession();
    session.hasRemoteVideo = function(){ return false; }
    test.incomingCall(session);
    test.equalCss(incomingcallview.acceptAudio, 'display', 'block');
    test.equalCss(incomingcallview.accept, 'display', 'none');
  });



});