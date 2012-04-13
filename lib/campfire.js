/**
 * The Campfire part
 **/

var Campfire = require("campfire").Campfire,
    server = require('./server'),
    _ = require('underscore'),
    socketio = require('./socket.io')

module.exports.instance = new Campfire({
  ssl     : true,
  token   : process.env.SUP_CAMPFIRE_TOKEN,
  account : process.env.SUP_CAMPFIRE_ACCOUNT
})

module.exports.connect = function() {
  module.exports.instance.join(process.env.SUP_CAMPFIRE_ROOMS, function(err, room) {
    if(err) throw err

    module.exports.room = room;

    // We're in, AWWW YEAAH
    console.log("[support.js] Joined Campfire channel. Great.")

    room.listen(function(message) {

      module.exports.instance.user(message.userId, function(err, user) {
        if(err) user = { name:"Philipp Spieß" }

        message.user = user.user
        // ignore messages from the bot and only respond to text messages

        if (message.type != "TextMessage" || message.user.name == process.env.SUP_CAMPFIRE_NAME) {
          return module.exports
        }


        if(message.body.match(/^support (info|stats|statu|stat)$/i) != null) {
          module.exports.info(room)
        }
      
        var object = message.body.match(/@sup-([a-zA-Z0-9._-]+) (.+)/i)
        if( object != null) {
          object = {
            user    : object[1],
            message : object[2],
            raw     : object[0]
          }
          module.exports.reply(room, object, message)
        }

        // room.speak(message.body)

      })
    })
  })
  return module.exports
}

/**
 * Do a friendly info screening
 **/
module.exports.info = function(room) {

  room.paste('Welcome to Support.js!\n\n\
' + socketio.sockets.length + ' clients connected and >9000 open conversations.\n\n\
To get stratet, just include the following snipped in your HTML:\n\
<script src=\"' + process.env.SUP_PATH + 'support.js\"></script>\n\
(Make sure you have jQuery loaded before)')

}

/**
 * Reply
 **/
module.exports.reply = function(room, data, raw) {
  
  var c = null
  for (var session in server.clients) {
    var client = server.clients[session]
    if(typeof client.user != 'undefined' && client.user == data.user)
      c = client
  }

  if(c == null) {
    room.speak("I don't know " + data.user + '. ):')
  } else {
    socketio.answer(c, data.message, raw.user, function(error) {
      if(error) {
        room.speak("Error while sending a message to @sup-" + data.user + "." )
      } else {
        room.speak("I've send @sup-" + data.user + " the message." )
      }
    })
  }
}

/**
 * Conversation
 **/
module.exports.send = function(client, message) {
  module.exports.room.speak('@sup-' + client.user + ': ' + message.message)
}

module.exports.start = function(client, message) {
  module.exports.room.speak('@sup-' + client.user +': ' + message.message + ' (Name: ' + client.name + ', Email: ' + client.email + ')')
}