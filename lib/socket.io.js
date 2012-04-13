/**
 * Socket IO Library
 **/

var _ = require('underscore'),
    socket = require('socket.io'),
    sockets = [],
    server = require('./server'),
    campfire = require('./campfire')

module.exports.sockets = sockets

module.exports.connect = function(app) {
  
  var io = module.exports.io = socket.listen(app)

  /**
   * Authorization (based on socket.io's handshake protocol)
   * Tie the socket to a session!
   **/
  io.configure(function (){
    io.set('authorization', function (handshakeData, callback) {
      if(typeof server.clients[handshakeData.query.token] == 'undefined') {
        callback(null, false)
      } else {
        handshakeData.token = handshakeData.query.token
        handshakeData.client =  function() {
          return server.clients[this.token]
        }
        callback(null, true)
      }
    })
  })

  /**
   * Handle the request
   **/
  io.sockets.on('connection', function (socket) {
    sockets.push(socket)

    socket.on('support.js:register', function(msg) {
      try {
        var client = socket.handshake.client()
        console.log(msg)
        if(typeof client.user == 'undefined') {
          client.name = msg.name;
          client.email = msg.email;
          client.user = formatForUrl(msg.name)

          socket.emit('support.js:register', { client : client })

        } else {
          socket.emit('support.js:register', { error: 'already registered', client: client })
        }
      } catch(e) {
        console.log(e.toString())
      }
    })

    socket.on('support.js', function(msg) {
      try {
        var client = socket.handshake.client()
        if(typeof client.user != 'undefined') {
          /** 
           * Check if the conversation already exists, otherwise create a new!
           **/

          if(_.has(server.conversations, client.user)) {
            campfire.send(client, msg)
          } else {
            server.conversations[client.user] = new Date()
            campfire.start(client, msg)
          }
         console.log(msg)
        }
      } catch(e) {
        console.log(e.toString())
      }
    })

    socket.on('disconnect', function() {
      module.exports.sockets = sockets = _.without(sockets, socket)
    })
  })

  return module.exports;
}


/**
 * Le famouse broadcast method. Not used, yet.
 */
module.exports.broadcast = function(channel, message) {
  _.each(sockets, function(socket) {
    socket.emit(channel, message)
  })
}


/**
 * Thanks to http://stackoverflow.com/questions/2297902/urlify-user-input-in-real-time
 **/
function formatForUrl(str) {
    return str.replace('ß', 'ss')    // I take this personally
        .replace(/_/g, '-')
        .replace(/ /g, '-')
        .replace(/:/g, '-')
        .replace(/\\/g, '-')
        .replace(/\//g, '-')
        .replace(/[^a-zA-Z0-9\-]+/g, '')
        .replace(/-{2,}/g, '-')
        .toLowerCase();
};

/**
 * Le answer ;)
 **/
module.exports.answer = function(client, message, who, fn) {

  // Delayed Spam = resend message, because the user could be on a page reload ;)
  function delayedSpam(client, message, who, fn, tries) {
    var sent = false
    console.log('sockets.length = ' + sockets.length)
    _.each(sockets, function(socket) {

      console.log(socket.handshake)

      if( typeof socket.handshake.client == 'function' && socket.handshake.client().token == client.token ) {
        socket.emit('support:js', { who: who.name, message:message })
        sent = true
      }
    })

    if( !sent && tries < 10 ) {
      setTimeout(function() {
        delayedSpam(client, message, who, fn, ++tries)
      }, 1000)
    } else if(!sent) {
      if(typeof fn == 'function')
        fn(new Error('Not send'), message)
    } else {
      if(typeof fn == 'function')
        fn(null, message)
    }
  }

  delayedSpam(client, message, who, fn, 0)
}