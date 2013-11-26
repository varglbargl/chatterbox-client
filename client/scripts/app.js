// YOUR CODE HERE:
$(document).ready(function (){
  var lastId = "";
  var chatRooms = [];
  var currentRoom = "all";

  var security = new RegExp("[a-zA-Z0-9_,\s \.\#\?\!\:\(\)\'\-]*");

  $(".submit").click(function () {
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      data: JSON.stringify({username: "null", text: $(".textbox").val(), roomname: currentRoom}),
      type: "POST",
      contentType: 'application/json',
      dataType: "json",
      success: function (data) {
        $(".textbox").val("");
        fetch();
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  });

  var fullGet = function(){
    $.get( "https://api.parse.com/1/classes/chatterbox?order=-createdAt", function(data) {
      for (var i = 0; i < data.results.length; i++) {
        var text = security.exec(data.results[i].text);
        var name = security.exec(data.results[i].username);
        var room = security.exec(data.results[i].roomname).join("");
        //var text = data.results[i].text;
        //var name = data.results[i].username;
        if(text !== null && data.results[i].objectId !== lastId && (room === currentRoom || currentRoom === "all")){
          $(".chatbox").append("<span class=\"message " + room + "\"><b>" + name + ":</b> " + text + "</span><br class=\"message\" />");
          lastId = data.results[0].objectId;
          if(chatRooms.indexOf(room) === -1){
            $(".chatrooms").append('<span class="roomname">' + room + "</span><br />");
            chatRooms.push(room);
            $(".roomname").on('click', function () {
              currentRoom = $(this).text();
              //console.log(currentRoom);
              $(".message").remove();
              $(".chatbox").prepend("<span class=\"message server\"><b> Switched to room " + currentRoom + "</b></span><br class=\"message\" />");
            });
          }
        }
      };
    });
  };

  var fetch = function () {
    $.ajax({
      url: "https://api.parse.com/1/classes/chatterbox?order=-createdAt",
      type: "GET",
      contentType: "application/json",
      success: function(data) {
        var text = security.exec(data.results[0].text);
        var name = security.exec(data.results[0].username);
        var room = security.exec(data.results[0].roomname).join("");
        if(text !== null && data.results[0].objectId !== lastId && (room === currentRoom || currentRoom === "all")){
          $(".chatbox").prepend("<span class=\"message " + room + "\"><b>" + name + ":</b> " + text + "</span><br class=\"message\" />");
          lastId = data.results[0].objectId;
          if(chatRooms.indexOf(room) === -1){
            $(".chatrooms").append('<span class="roomname">' + room + "</span><br />");
            chatRooms.push(room);
            $(".roomname").on('click', function () {
              currentRoom = $(this).text();
              //console.log(currentRoom);
              $(".message").remove();
              $(".chatbox").prepend("<span class=\"message server\"><b> Switched to room " + currentRoom + "</b></span><br class=\"message\" />");
            });
          }
        }
      }
    });
  };

  setInterval(fetch, 1000);
  fullGet();

  console.log(window._userName);

});