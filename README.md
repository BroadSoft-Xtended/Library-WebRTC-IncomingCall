# Incoming Call

Handles incoming calls.

Model : bdsft_webrtc.default.incomingcall
View : bdsft_webrtc.default.incomingcallview
Dependencies : [SIP Stack](https://github.com/BroadSoft-Xtended/Library-WebRTC-SIPStack), [Sound](https://github.com/BroadSoft-Xtended/Library-WebRTC-Sound)

## Elements
<a name="elements"></a>

Element        |Type    |Description
---------------|--------|-----------------------------------------------------------------------------
accept         |button  |Button to accept the incoming call.
displayName    |span    |Displays the caller's name.
dropAndAccept  |button  |Button to drop the current active call and to accept the new incoming call.
holdAndAccept  |button  |Button to hold the current active call and to accept the new incoming call.
reject         |button  |Button to reject the incoming call.
user           |span    |Displays the caller's User ID.

## Properties
<a name="properties"></a>

Property     |Type    |Description
-------------|--------|-------------------------
displayName  |string  |Display name of callee.
user         |string  |User name of callee.

## Methods
<a name="methods"></a>

Method           |Parameters  |Description
-----------------|------------|------------------------------------------------------------------
accept()         |            |Accepts the incoming call.
dropAndAccept()  |            |Drops the current active call and accepts the new incoming call.
holdAndAccept()  |            |Holds the current active call and accepts the new incoming call.
reject()         |            |Rejects the incoming call.

