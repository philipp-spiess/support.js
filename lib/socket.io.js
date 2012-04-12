/**
 * Socket IO Library
 **/

var _ = require('underscore'),
    socket = require('socket.io'),
    sockets = [],
    server = require('./server')

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

    socket.on('support.js', function(msg) {
      console.log(socket.handshake.client())
      console.log(msg)
    })

    socket.on('disconnect', function(socket) {
      sockets = _.without(sockets, socket)
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