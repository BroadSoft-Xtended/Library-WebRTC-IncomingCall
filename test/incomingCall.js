var jsdom = require('mocha-jsdom');
expect = require('expect');
jsdom({});

describe('incomingcall', function() {

  before(function(){
    core = require('webrtc-core');
    testUA = core.testUA;
    testUA.createCore('sipstack');
    testUA.createModelAndView('incomingcall', {incomingcall: require('../')});
    eventbus = bdsft_client_instances.test.eventbus;
    testUA.mockWebRTC();
  });
  afterEach(function(){
    incomingcall.reject();
    testUA.endCall();
  });

  it('1st incoming call:', function() {
    sipstack.enableAutoAnswer = false;
    testUA.connect();
    var session = testUA.incomingSession();
    var answerOptions = "";
    session.answer = function(options) {
      answerOptions = options;
    }
    testUA.incomingCall(session);
    expect(answerOptions).toEqual("", "Answer should not have been called");
    expect(incomingcallview.displayName.text()).toEqual("Incoming DisplayName");
    expect(incomingcallview.user.text()).toEqual("Incoming User");
    expect(incomingcall.visible).toEqual(true);
    testUA.isVisible(incomingcallview.view.find('.callPopup'), true);
    expect(incomingcallview.dropAndAccept.css('display')).toEqual('none');
    expect(incomingcallview.holdAndAccept.css('display')).toEqual('none');
    expect(incomingcallview.accept.css('display')).toEqual('block');
  });

  it('incoming call and cancel', function() {
    sipstack.enableAutoAnswer = false;
    testUA.connect();
    var session = testUA.incomingSession();
    var answerOptions = "";
    session.answer = function(options) {
      answerOptions = options;
    }
    testUA.incomingCall(session);
    expect(answerOptions).toEqual("", "Answer should NOT have been called");
    testUA.isVisible(incomingcallview.view.find('.callPopup'), true);
    session.failed('remote', null, core.exsip.C.causes.CANCELED);
    testUA.isVisible(incomingcallview.view.find('.callPopup'), false);
  });

  // it('1st incoming call with enableAutoAnswer', function() {
  //   sipstack.enableAutoAnswer = true;
  //   testUA.connect();
  //   var session = testUA.incomingSession();
  //   var answerOptions = "";
  //   session.answer = function(options) {
  //     answerOptions = options;
  //   }
  //   testUA.isVisible(incomingcallview.callPopup, false);
  //   testUA.incomingCall(session);
  //   expect(answerOptions).toNotEqual("", "Answer should have been called");
  //   testUA.isVisible(incomingcallview.callPopup, false);
  // });

  // it('2nd incoming call with enableAutoAnswer', function() {
  //   sipstack.enableAutoAnswer = true;
  //   testUA.connect();
  //   testUA.startCall();
  //   var session = testUA.incomingSession();
  //   var answerOptions = "";
  //   session.answer = function(options) {
  //     answerOptions = options;
  //   }
  //   testUA.incomingCall(session);
  //   expect(answerOptions).toEqual("", "Answer should not have been called");
  //   expect(incomingcallview.incomingCallName.text()).toEqual("Incoming DisplayName");
  //   expect(incomingcallview.incomingCallUser.text()).toEqual("Incoming User");
  //   testUA.isVisible(incomingcallview.callPopup, true);
  //   testUA.isVisible(incomingcallview.dropAndAccept, true);
  //   testUA.isVisible(incomingcallview.holdAndAccept, true);
  //   testUA.isVisible(incomingcallview.accept, false);
  // });

  it('2nd incoming call and hold and answer click', function() {
    sipstack.enableAutoAnswer = true;
    testUA.connect();
    var outgoingSession = testUA.outgoingSession();
    testUA.startCall(outgoingSession);
    var incomingSession = testUA.incomingSession();
    var answerOptions = "";
    incomingSession.answer = function(options) {
      answerOptions = options;
      incomingSession.started('local');
    }
    testUA.incomingCall(incomingSession);

    expect(sipstack.activeSession === outgoingSession).toEqual(true, "Outgoing session should be active");
    expect(sipstack.sessions.length).toEqual( 2);
    incomingcallview.holdAndAccept.trigger("click");
    expect(sipstack.activeSession === incomingSession).toEqual(true, "Incoming session should be active");
    expect(sipstack.sessions.length).toEqual( 2);
    expect(answerOptions).toNotEqual("", "Answer should have been called");
  });

  it('2nd incoming call and hold and answer click and resume 1st call after 2nd ends', function() {
    sipstack.enableAutoAnswer = true;
    testUA.connect();
    var outgoingSession = testUA.outgoingSession();
    testUA.startCall(outgoingSession);
    var incomingSession = testUA.incomingSession();
    testUA.incomingCall(incomingSession);

    incomingcallview.holdAndAccept.trigger("click");
    expect(sipstack.activeSession === incomingSession).toEqual(true, "Incoming session should be active");
    eventbus.endCall();
    expect(sipstack.activeSession === outgoingSession).toEqual(true, "Outgoing session should be active again");
    expect(sipstack.sessions.length).toEqual(1);
  });

  it('2nd incoming call and drop and answer click', function() {
    sipstack.enableAutoAnswer = true;
    testUA.connect();
    var outgoingSession = testUA.outgoingSession();
    testUA.startCall(outgoingSession);
    var incomingSession = testUA.incomingSession();
    incomingSession.answer = function(options) {
      answerOptions = options;
      incomingSession.started('local');
    }
    testUA.incomingCall(incomingSession);

    expect(sipstack.activeSession === outgoingSession).toEqual(true, "Outgoing session should be active");
    expect(sipstack.sessions.length).toEqual( 2);
    incomingcallview.dropAndAccept.trigger("click");
    expect(sipstack.activeSession === incomingSession).toEqual(true, "Incoming session should be active");
    expect(sipstack.sessions.length).toEqual( 1);
    expect(answerOptions).toNotEqual("", "Answer should have been called");
  });

  it('call and hangup and incoming call', function() {
    sipstack.enableAutoAnswer = false;
    testUA.connect();
    testUA.startCall();
    testUA.endCall();
    testUA.incomingCall();
    testUA.isVisible(incomingcallview.view.find('.callPopup'), true);
    expect(incomingcallview.dropAndAccept.css('display')).toEqual('none');
    expect(incomingcallview.holdAndAccept.css('display')).toEqual('none');
    expect(incomingcallview.accept.css('display')).toEqual('block');
  });
  it('window.onbeforeunload', function() {
    testUA.connect();
    var session = testUA.incomingSession();
    var terminated = false;
    session.terminate = function(options) {
      terminated = true;
    }
    testUA.incomingCall(session);
    window.onbeforeunload();
    expect(terminated).toEqual(true, "Should terminate the incoming session");
  });


});