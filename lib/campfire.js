/**
 * The Campfire part
 **/

var Campfire = require("campfire").Campfire

module.exports.instance = new Campfire({
  ssl     : true,
  token   : process.env.SUP_CAMPFIRE_TOKEN,
  account : process.env.SUP_CAMPFIRE_ACCOUNT
})

module.exports.connect = function() {
  module.exports.instance.join(process.env.SUP_CAMPFIRE_ROOMS, function(err, room) {
    if(err) throw err

    // We're in, AWWW YEAAH
    console.log("[support.js] Joined Campfire channel. Great.")

    room.listen(function(message) {
      // ignore messages from the bot and only respond to text messages
      if (message.type != "TextMessage" || message.userId == process.env.SUP_CAMPFIRE_USERID) {
        return module.exports
      }


      // Do a fucking echo!
      // console.log(message)
      room.speak(message.body)

    })
  })

  return module.exports
}