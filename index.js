$(document).ready(function(){
  if(!localStorage.sourcePeer){
    $("#enterName").removeClass("hidden");
  }
  else {
    ChatRTC.uiName();
  }

  ChatRTC.socket = io('https://5047cc02.ngrok.io');
  ChatRTC.socket.on('connect', function(){
    console.log("connected");
    ChatRTC.socket.emit('message', {connectHash: localStorage.sourcePeer, type: "init"});
  })
  ChatRTC.socket.on('message', function(data){
    ChatRTC.onSocketIOMessage(data);
  })
});
