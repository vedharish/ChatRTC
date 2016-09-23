function WebRTC() {
  var that = this;
  var ice = { "iceServers": [
    {"url": "stun:stun.l.google.com:19302"}
  ]};

  var mediaConstraints = { 
    mandatory: {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    }
  };

  var peer = new RTCPeerConnection(ice);
  peer.onicecandidate = function(event) {
    console.log(event, that.onReady);
    if (event.candidate === null) {
      var sdp = peer.localDescription;
      if(that.onReady) that.onReady(sdp);
    }
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
      peer.createOffer(function(desc){
        console.log("Started offer creation", peer.localDescription);
        peer.setLocalDescription(desc, function () {}, function(){});
      }, function(e){
        console.log("error", e)
      }, mediaConstraints);

      that.onReady = cb;
    },

    receiveOfferAndGetAnswer: function(offer, cb){
      peer.setRemoteDescription(offer, function(){
        console.log("Starting answer");
        peer.createAnswer(function(answer){
          console.log("Done answer", answer);
          peer.setLocalDescription(answer, function(){
            console.log("Answer", answer);
          });
        }, function(e){
          console.log("error", e);
        });
      });

      that.onReady = cb;
    },

    receiveAnswer: function(answer){
      peer.setRemoteDescription(answer);
    }
  }
}
