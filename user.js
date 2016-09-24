var User = {
  logout: function() {
    delete localStorage.sourcePeer;
    $("#nameBox").val('');
    $("#welcomePeer").addClass("hidden");
    $("#messageContent").addClass("hidden");
    $("#enterName").removeClass("hidden");
  },

  change: function() {
    $("#sourceName").val(localStorage.sourcePeer);
    $("#welcomePeer").addClass("hidden");
    $("#enterName").removeClass("hidden");
  },

  switchToChat: function() {
    $('#videoContent').addClass("hidden");
    $('#chatContent').removeClass("hidden");
    $('#showChatContent').addClass("hidden");
    $('#showVideoContent').removeClass("hidden");
    $('#chatTitleChatRTC').removeClass("hidden");
    $('#chatTitleVideoRTC').addClass("hidden");
  },

  switchToVideo: function() {
    console.log("Switching to VideoRTC");
    $('#videoContent').removeClass("hidden");
    $('#chatContent').addClass("hidden");
    $('#showChatContent').removeClass("hidden");
    $('#showVideoContent').addClass("hidden");
    $('#chatTitleChatRTC').addClass("hidden");
    $('#chatTitleVideoRTC').removeClass("hidden");
  }
}
