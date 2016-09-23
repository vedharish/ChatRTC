var ChatRTC = {
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
    chan.onerror = function(error) {  }
    chan.onclose = function() {  }

    chan.onopen = function(evt) {
      chan.send("connected");
    }

    chan.onmessage = function(msg) {
      elem.append("["+member+"] " + msg + '<br />');
    }
  },

  connectToMember: function(member){
    var conn = new WebRTC();
    var dc = conn.createDC();
    ChatRTC.handlerDC(dc, member);
    conn.createOffer(function(offer){
      console.log(offer);
      ChatRTC.socket.emit('message', {connectHash: member, type: "offer", data: offer});
    });
  },

  onSocketIOMessage: function(data){
    console.log(data);
  }
}
