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
    console.log(event, that.onOffer);
    if (event.candidate === null) {
      var sdp = peer.localDescription;
      if(that.onOffer) that.onOffer(sdp);
    }
  };

  return {
    createDC: function(channelName) {
      var dc = peer.createDataChannel(channelName, {reliable: true});
      return dc;
    },

    createOffer: function(cb) {
      peer.createOffer(function(desc){
        console.log("Started offer creation", peer.localDescription);
        peer.setLocalDescription(desc, function () {}, function(){});
      }, function(e){
        console.log("error", e)
      }, mediaConstraints);

      that.onOffer = cb;
    }
  }
}
