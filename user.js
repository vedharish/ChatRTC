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
  }
}
