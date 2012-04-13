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
var app = require('./lib/server').server

/**
 * The socket.io realtime part
 */
var socket = require('./lib/socket.io').connect(app)


app.listen(process.env.PORT || 3000)