function WebRTC() {
  var isVideoSession = true;
  var that = this;
  var ice = { "iceServers": [
    {"url": "stun:stun.l.google.com:19302"}
  ]};
  var localStream = null;

  var mediaConstraints = { 
    mandatory: {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    }
  };

  var constraints = {
    audio: true, 
    video: { 
      mandatory: {
      },
      optional: [  
        { width: { max: 1280 }},
        { frameRate: 30 },
        { facingMode: "user" }
      ]
    }
  }

  var peer = new RTCPeerConnection(ice);
  peer.onicecandidate = function(event) {
    console.log(event, that.onReady);
    if (event.candidate === null) {
      var sdp = peer.localDescription;
      if(that.onReady) that.onReady(sdp);
    }
  };
  peer.onaddstream = function(event) {
    console.log("GOT REMOTE STREAM!!!!!!!!!", event, that.onReady);
    var remoteVideo = document.getElementById('video');
    remoteVideo.src = window.URL.createObjectURL(event.stream);
  };

  return {
    createDC: function(channelName) {
      var dc = peer.createDataChannel(channelName, {reliable: true});
      return dc;
    },

    receiveDC: function(cb){
      peer.ondatachannel = function(e){
        cb(e.channel);
      }
    },

    createOffer: function(cb) {
      navigator.getUserMedia(constraints, function(stream) {
        console.log("Got Stream");
        var remoteVideo = document.getElementById('localVideo');
        remoteVideo.src = window.URL.createObjectURL(stream);
        localStream = stream;

        peer.addStream(localStream);
        peer.createOffer(function(desc){
          console.log("Started offer creation", peer.localDescription);
          peer.setLocalDescription(desc, function () {}, function(){});
        }, function(e){
          console.log("error", e)
        }, mediaConstraints);
      }, function(error) {
        console.log("Error in  Stream");
      });

      that.onReady = cb;
    },

    receiveOfferAndGetAnswer: function(offer, cb){
      that.offer = offer;

      navigator.getUserMedia(constraints, function(stream) {
        console.log("Got Stream");
        var remoteVideo = document.getElementById('localVideo');
        remoteVideo.src = window.URL.createObjectURL(stream);
        that.localStream = stream;
        peer.addStream(stream);

        peer.setRemoteDescription(that.offer, function(){
          console.log("Starting answer");
          peer.createAnswer(function(answer){
            console.log("Done answer", answer);
            peer.setLocalDescription(answer, function(){
              console.log("Answer", answer);
            }, function() {});
          }, function(e){
            console.log("error", e);
          });
        }, function() {});
      }, function(error) {
        console.log("Error in  Stream");
      });

      that.onReady = cb;
    },

    receiveAnswer: function(answer){
      //chan.onaddstream = function(e) {
      //  console.log("ON ADD STREAM ", e);
      //  var remoteVideo = document.getElementById('video');
      //  remoteVideo.src = window.URL.createObjectURL(e.stream);
      //}
      peer.setRemoteDescription(answer);
    }
  }
}
