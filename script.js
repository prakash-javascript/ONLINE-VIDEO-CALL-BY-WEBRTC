// Generate random room name if needed
if (!location.hash) {
  location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
const roomHash = location.hash.substring(1);
  
// TODO: Replace with your own channel ID
const drone = new ScaleDrone('y0N6q0oVsjY9fEiu');
// Room name needs to be prefixed with 'observable-'
const roomName = 'observable-' + roomHash;
const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};
let room;
let pc;
  
  
function onSuccess() {};
function onError(error) {
  console.error(error);
};
  
drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  room = drone.subscribe(roomName);
  room.on('open', error => {
    if (error) {
      onError(error);
    }
  });
  // We're connected to the room and received an array of 'members'
  // connected to the room (including us). Signaling server is ready.
  room.on('members', members => {
    console.log('MEMBERS', members);
    // If we are the second user to connect to the room we will be creating the offer
    const isOfferer = members.length === 2;
    startWebRTC(isOfferer);
  });
});
  
// Send signaling data via Scaledrone
function sendMessage(message) {
  drone.publish({
    room: roomName,
    message
  });
}
  
function startWebRTC(isOfferer) {
  pc = new RTCPeerConnection(configuration);
  
  // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
  // message to the other peer through the signaling server
  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({'candidate': event.candidate});
    }
  };
  
  // If user is offerer let the 'negotiationneeded' event create the offer
  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer().then(localDescCreated).catch(onError);
    }
  }
  
  // When a remote stream arrives display it in the #remoteVideo element
  pc.onaddstream = event => {
    remoteVideo.srcObject = event.stream;
  };
  
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  }).then(stream => {
    // Display your local video in #localVideo element
    localVideo.srcObject = stream;
    // Add your stream to be sent to the conneting peer
    pc.addStream(stream);
  }, onError);
  
  // Listen to signaling data from Scaledrone
  room.on('data', (message, client) => {
    // Message was sent by us
    if (client.id === drone.clientId) {
      return;
    }
  
    if (message.sdp) {
      // This is called after receiving an offer or answer from another peer
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        // When receiving an offer lets answer it
        if (pc.remoteDescription.type === 'offer') {
          pc.createAnswer().then(localDescCreated).catch(onError);
        }
      }, onError);
    } else if (message.candidate) {
      // Add the new ICE candidate to our connections remote description
      pc.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onError
      );
    }
  });
}
  
function localDescCreated(desc) {
  pc.setLocalDescription(
    desc,
    () => sendMessage({'sdp': pc.localDescription}),
    onError
  );
}

    function gogoTo()
  {
    var date = new Date();
  var hour = date.getHours();
  var mm = date.getMinutes();
  var dt = date.getDate();
  var mon = date.getMonth();
  var yr = date.getFullYear();
  var dy = date.getDay();
  if(dy==1){
    dy="MONDAY";
  }
  if(dy==2){
    dy="TUESDAY";
  }
  if(dy==3){
    dy="WEDNESDAY"
  }
  if(dy==4){
    dy="THURSDAY";
  }
  if(dy==5){
    dy="FRIDAY";
  }
  if(dy==6){
    dy="SATURDAY";
  }
  if(dy==7){
    dy="SUNDAY";
  }
  var da ="AM";
  if(da<12){
    da="AM";
  }
  else{
    da="PM";
  }
  if(hour>12){
    hour= hour-12;
  }
    var tt = "Today ! Date is "+dy+" "+dt+"-"+mon+"-"+yr+"<br>"+hour+":"+mm+" "+da;
    document.getElementById("hh").innerHTML=tt;

  };
  setInterval(gogoTo,1);
  