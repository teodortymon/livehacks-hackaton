/* videochatroom.js */
// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 
// Start user
var peer = new Peer({ key: '51gyo10uq9pv6lxr', debug: 1, secure:true});
peer.on('open', function(){
  $('#mypeerid').append("Your peer id: " + peer.id);
});
peer.on('call', function(call){
  console.log("Call received");
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer(window.localStream);
  processCall(call);
});
peer.on('error', function(err){
  console.log(err.message);
});
 
 
$(function(){
  $('#call').bind('click', callPeer);
  getLocalVideo();
});
 
 
 
// Call/Video Management
function getLocalVideo() {
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    console.log("Local video streaming");
    $('#videos').append("<video id='" + peer.id + "' autoplay></video>");
    $('#' + peer.id).prop('src', URL.createObjectURL(stream));
    window.localStream = stream;
  }, function(){ alert('Cannot connect to webcam. Allow access.') });
}
 
function callPeer() {
  console.log("Calling peer");
  var call = peer.call($('#remotepeerid').val(), window.localStream);
  processCall(call);
}
 
function processCall(call) {
  // Hang up on an existing call if present
  // if (window.existingCall) {
  //   window.existingCall.close();
  // }
 
  // Wait for stream on the call, then set peer video display
  call.on('stream', function(remoteStream){
    console.log("Adding video from " + call.peer);
    $('#videos').append("<video id='" + call.peer + "' autoplay>");
    $('#' + call.peer).prop('src', URL.createObjectURL(remoteStream));
  });
 
  // UI stuff
  window.existingCall = call;
  //document.getElementById('their-id').text(call.peer);
  //call.on('close', prepareDebateScreen);
}
 
function endCall() {
  window.existingCall.close();
  step2();
}
 
function retry() {
  console.log('Retry...');
}
