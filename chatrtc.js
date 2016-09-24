var ChatRTC = {
  peers: {},
  dcs: {},

  initName: function(){
    localStorage.sourcePeer = $("#nameBox").val();
    ChatRTC.uiName();
    return false;
  },

  uiName: function(){
    $("#sourceName").text(localStorage.sourcePeer);
    $("#welcomePeer").removeClass("hidden");
    $("#messageContent").removeClass("hidden");
    $("#enterName").addClass("hidden");
  },

  onMessage: function(){
    var message = $("#messageBox").val();
    var elem = $("#chatlog");
    elem.append("["+localStorage.sourcePeer+"] " + message + '<br />');
    $("#messageBox").val('');
    elem.scrollTop(elem.get(0).scrollHeight);
    ChatRTC.sendToDC(message);
    return false;
  },

  onMember: function(){
    var member = $("#memberBox").val();
    var elem = $("#memberlog");
    elem.prepend('<div style="margin: 8px auto;" id="member-'+member+'"><strong>'+member+'</strong><br/><span class="status small">Connecting</span></div>');
    $("#memberBox").val('');
    ChatRTC.connectToMember(member);
    return false;
  },

  handlerDC: function(chan, member){
    ChatRTC.dcs[member] = chan;
    chan.onerror = function(error) {  }
    chan.onclose = function() {  }

    chan.onopen = function(evt) {
      console.log("data channel opened");
      chan.send("connected");
    }
    chan.onmessage = function(e) {
      console.log("data channel received message", e.data);
      if(e.data == "connected")
        $("#member-" + member + ">.status").text("Connected");

      $("#chatlog").append("["+member+"] " + e.data + '<br />');
    }
  },

  sendToDC: function(message){
    for(var i in ChatRTC.dcs){
      ChatRTC.dcs[i].send(message);
    }
  },

  connectToMember: function(member){
    var conn = new WebRTC();
    ChatRTC.peers[member] = conn;
    var dc = conn.createDC();
    ChatRTC.handlerDC(dc, member);
    conn.createOffer(function(offer){
      console.log(offer);
      ChatRTC.socket.emit('message', {connectHash: member, source: localStorage.sourcePeer, type: "offer", data: offer});
    });
  },

  receiveRequestFromMember: function(offer, member, source){
    var conn = new WebRTC();
    ChatRTC.peers[source] = conn;
    conn.receiveDC(function(dc){
      ChatRTC.handlerDC(dc, source);
    });
    conn.receiveOfferAndGetAnswer(offer, function(answer){
      console.log(answer);
      ChatRTC.socket.emit('message', {connectHash: source, source: localStorage.sourcePeer, type: "answer", data: answer});
    })
  },

  receiveAnswerFromMember: function(answer, member, source){
    ChatRTC.peers[source].receiveAnswer(answer);
  },

  onSocketIOMessage: function(data){
    console.log(data);
    switch(data.sourceData.type){
      case "offer":
        ChatRTC.receiveRequestFromMember(data.sourceData.data, data.sourceData.connectHash, data.sourceData.source);
        break;

      case "answer":
        ChatRTC.receiveAnswerFromMember(data.sourceData.data, data.sourceData.connectHash, data.sourceData.source);
        break;

    }
  }
}
