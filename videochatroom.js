/* videochatroom.js */
// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 
function pretty_time_string(num) {
    return ( num < 10 ? "0" : "" ) + num;
  }

var start = new Date;    

setInterval(function() {
  var total_seconds = (new Date - start) / 1000;   

  var hours = Math.floor(total_seconds / 3600);
  total_seconds = total_seconds % 3600;

  var minutes = Math.floor(total_seconds / 60);
  total_seconds = total_seconds % 60;

  var seconds = Math.floor(total_seconds);

  hours = pretty_time_string(hours);
  minutes = pretty_time_string(minutes);
  seconds = pretty_time_string(seconds);

  var currentTimeString = minutes + ":" + seconds;

  $('.Timer').text(currentTimeString);
}, 1000);

var peer;
var keep_searching = true;
function makePeer(id_number){

console.log("TRYING TO MAKE A PEER WITH PEER NUMBER ");
console.log(id_number);
// Start user
peer = new Peer(id_number, { key: '51gyo10uq9pv6lxr', debug: 1, id:id_number});
peer.on('open', function(){
  console.log('yayyyyy');
  getLocalVideo();
  getPreviousStreams();

});
peer.on('call', function(call){
  console.log("Call received");
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer(window.localStream);
  call.on('error', function()
  {
    $('#'+call.peer).remove();
  })
  processCall(call);
});
peer.on('error', function(err){
  console.log(err.message);
  if (err.type == 'unavailable-id')
  {
    makePeer(id_number +1);
  }
});
}

makePeer(1);



 
// $(function(){
//   $('#call').bind('click', callPeer);
//   getLocalVideo();
// });

// getLocalVideo();


function getPreviousStreams(){
console.log('do we have a localstream');
var i = 1;
while (keep_searching)
{
  call_Id(i);
  i++;
  if (i > 10){
    keep_searching = false;
  }
}
// console.log(window.localStream);
// for (var i = 1; i< peer.id; i++)
// {
//   call_Id(i);
// } 
}
 
// Call/Video Management
function getLocalVideo() {
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    console.log("Local video streaming");
    $('#videos').append("<div class='col-s12 center-align'><video id='" + peer.id + "' autoplay></video></div>");
    $('#' + peer.id).prop('src', URL.createObjectURL(stream));
    window.localStream = stream;
    getPreviousStreams();

  }, function(){ alert('Cannot connect to webcam. Allow access.') });
}
 
function callPeer() {
  console.log("Calling peer");
  var call = peer.call($('#remotepeerid').val(), window.localStream);
  processCall(call);
}

function call_Id(id_number) {
  console.log("Calling peer", id_number);
  var call = peer.call(id_number, window.localStream);
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
    $('#videos').append("<div class='col-s12 center-align'><video id='" + call.peer + "' autoplay></div>");
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
