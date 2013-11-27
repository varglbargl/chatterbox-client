// YOUR CODE HERE:

var lastId = "";
var chatRooms = [];
var currentRoom = "all";
var security = new RegExp("[a-zA-Z0-9_,\s \=\.\@\#\?\!\:\(\)\'\"\-]*");
var username = "";

var getUsername = function(){
  var query = window.location.search;
  var urlSearch = query.split("=");
  username = urlSearch[urlSearch.length-1];
};

// posting messages

var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox'
});

var Messages = Backbone.Collection.extend({
  model: Message
});

var MessageView = Backbone.View.extend({
  initialize: function () {
    this.collection.on("add", this.updateChat, this);
    this.collection.on("add", this.clearInput, this);
  },
  events: {
    "click button": "sendMessage",
    "touch fuzzy": "getDizzy"
  },
  sendMessage: function () {
    this.collection.create({
      username: username,
      text: this.$("input").val(),
      roomname: currentRoom
    });
  },
  updateChat: function () {
    //fetch();
  },
  clearInput: function () {
    this.$("input").val("");
  }
});

// fetching messages

var Stream = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
  getUpstream: function () {
    this.fetch();
  }
});

var StreamView = Backbone.View.extend({
  initialize: function () {
    this.model.on("change", this.render, this);
    var that = this;
    setInterval(function () { that.model.fetch(); }, 1000);
  },
  events: {
    "cross streams": "somethingVeryBad"
  },
  render: function () {
    var data = this.model.toJSON();
    var text = security.exec(data.results[0].text);
    var name = security.exec(data.results[0].username);
    var room = security.exec(data.results[0].roomname).join("");
    if(text !== null && data.results[0].objectId !== lastId && (room === currentRoom || currentRoom === "all")){
      this.$el.prepend("<span class=\"message " + room + "\"><b>" + name + ":</b> " + text + "</span><br class=\"message\" />");
      lastId = data.results[0].objectId;
      if(chatRooms.indexOf(room) === -1){
        $(".chatrooms").append('<span class="roomname">' + room + "</span><br />");
        chatRooms.push(room);
        $(".roomname").on('click', function () {
          currentRoom = $(this).text();
          //console.log(currentRoom);
          $(".message").remove();
          this.$el.prepend("<span class=\"message server\"><b> Switched to room " + currentRoom + "</b></span><br class=\"message\" />");
        });
      }
    }
  }
});

// old, and working, code

var fullFetch = function(){
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
            $(".message").remove();
            $(".chatbox").prepend("<span class=\"message server\"><b> Switched to room " + currentRoom + "</b></span><br class=\"message\" />");
          });
        }
      }
    };
  });
};

$(document).ready(function (){

  fullFetch();
  getUsername();

  var message = new Messages();
  new MessageView({el: $(".messagebox"), collection: message});

  var stream = new Stream();
  new StreamView({el: $(".chatbox"), model: stream});

//});



















  // secret shoutbot code

  var yo = ["Get dunked", "What's up", "Keep walking", "Go to sleep", "Never change", "You're a star", "Have some of my fries", "Keep up the pace", "Congratulations", "How's it going", "Get a job", "Keep it real", "You can do it", "We're all very proud of you", "See ya later", "Give 'em hell", "You're my number one customer", "Outa my way"];
  var clam = ["Chuggin'", "Super", "Double", "Burger", "Danger", "Bunch a", "Hot", "Helicopter", "Horse", "Tiny", "Butter", "Slappy", "Dunder", "Slurpee", "Tuba", "Soup", "Dungeon", "Power", "Shrimp", "Star", "Lumpy", "Laundry", "Frowny", "Electro", "Flamingo", "Lumber", "Frumpy", "Monster", "Tiger", "Moon", "Oyster", "Clam", "Thunder", "Blunder", "Onion", "Chowder", "Shakey", "Math", "Dino", "Disco", "Jazz", "Motor", "Junior", "Piano", "Potato"];
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
      },
      error: function (data) {
        console.error('ERROR: Who knows');
      }
    });

    setTimeout(function() { spam(); }, Math.random() * 120000 + 120000);
  }

  setTimeout(function() { spam(); }, Math.random() * 60000 + 120000);
});