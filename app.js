/**
 * Support.js
 * @author Philipp Spieß <hello@philippspiess.com>
 **/


/**
 * The Campfire interactor
 */
var camp = require('./lib/campfire').connect()


/**
 * The webserver
 */
var app = require('./lib/server').server.listen(3000)


/**
 * The socket.io realtime part
 */
var socket = require('./lib/socket.io').connect(app)
