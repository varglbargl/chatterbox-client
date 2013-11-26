// YOUR CODE HERE:

var lastId = "";
var chatRooms = [];
var currentRoom = "all";
var security = new RegExp("[a-zA-Z0-9_,\s \=\.\@\#\?\!\:\(\)\'\-]*");
var events = _.clone(Backbone.Events);

var Message = function () {
  this.soup = "delicious";
};

Message.prototype.send = function (input) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: "POST",
    contentType: 'application/json',
    dataType: "json",
    data: JSON.stringify({username: input.username, text: input.text, roomname: input.roomname }),
    success: input.success,
    error: input.error
   });
};

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
            //fullGet();
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

var NewMessageView = function (options) {
  this.message = options.message;

  events.on("message:send", this.updateChat, this);
  events.on("message:send", this.clearInput, this);

  var add = $.proxy(this.sendMessage, this);
  $(".submit").click(add);
}

NewMessageView.prototype.sendMessage = function () {
  this.message.send({
    username: "A Backbone Tester",
    text: $(".textbox").val(),
    roomname: currentRoom,
    success: function () {
      events.trigger("message:send");
      console.log('chatterbox: Message sent');
    },
    error: function () {
      console.error('chatterbox: Failed to send message');
    }
  });
}

NewMessageView.prototype.clearInput = function () {
  $(".textbox").val("");
}

NewMessageView.prototype.updateChat = function () {
  fetch();
}

$(document).ready(function (){

  setInterval(fetch, 1000);
  fullGet();

  var message = new Message();
  new NewMessageView({message: message});









  // shoutbot

  var yo = ["What's up", "Keep walking", "Go to sleep", "Never change", "You're a star", "Have some of my fries", "Keep up the pace", "Congratulations", "How's it going", "Get a job", "Keep it real", "You can do it", "We're all very proud of you", "See ya later", "Give 'em hell", "You're my number one customer", "Outa my way"];
  var clam = ["Chuggin'", "Super", "Diaper", "Tons a", "Double", "Burger", "Danger", "Bunch a", "Hot", "Helicopter", "Horse", "Tiny", "Butter", "Slappy", "Dunder", "Slurpee", "Tuba", "Soup", "Dungeon", "Power", "Shrimp", "Star", "Lumpy", "Laundry", "Frowny", "Electro", "Flamingo", "Lumber", "Frumpy", "Monster", "Tiger", "Moon", "Oyster", "Clam", "Thunder", "Blunder", "Onion", "Chowder", "Shakey", "Math", "Dino", "Disco", "Jazz", "Motor", "Junior", "Piano", "Potato"];
  var hands = ["Tubs", "Patrol", "Wagon", "Dump", "Fun", "Stump", "Dooper", "Time", "Mode", "Zone", "Stamps", "Chunks", "Helmet", "Nuggets", "Pilot", "Boots", "Legs", "Guy", "Barrel", "Batter", "Shanks", "Phone", "Police", "Socks", "Bumbler", "Peepers", "Bags", "Spray", "Clown", "Shorts", "Goggles", "Pile", "Farm", "Dome", "Dude", "Jams", "Town", "Mash", "Mouth from Smash Mouth", "Wads", "Hugs", "Buns", "Boats", "Style", "Shades", "Store", "Guns", "Polish", "Mash", "Scoops", "Town", "Hands", "Rolls", "Puncher", "Gums", "House", "Blaster", "Damage", "Repellent", "Roller", "Stack", "Cannon"];

  var spam = function () {
    var botMessage = yo[Math.floor(Math.random() * yo.length)] +", " + clam[Math.floor(Math.random() * clam.length)] + " " + hands[Math.floor(Math.random() * hands.length)] + "!";

    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      data: JSON.stringify({username: "#ThingsToShoutAtPedestrians", text: botMessage, roomname: "all"}),
      type: "POST",
      contentType: 'application/json',
      dataType: "json",
      success: function (data) {
        fetch();
      },
      error: function (data) {
        console.error('ERROR: Who knows');
      }
    });

    setTimeout(function() { spam(); }, Math.random() * 50000 + 60000);
  }

  setTimeout(function() { spam(); }, Math.random() * 50000 + 60000);
});