/**
 * The Webserver and it's dirtyness
 **/

var http = require("http"),
    fs = require("fs"),
    socket_io_client = 'node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js',
    support_js_client = 'public/support.js',
    stylus = require('stylus')


// A place to store ALL the sessions
module.exports.clients = []

module.exports.server = http.createServer(function (req, res) {
  /**
   * YIPPI, COOKIES!
   **/
  var cookies = {};
  req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });


  // Check if the session is already created
  var created = false
  if(typeof cookies.__sjs != 'undefined' && typeof module.exports.clients[cookies.__sjs] != 'undefined') {
    created = true
  }

  if(!created) {
    // Create a new session
    console.log('[support.js] Creating new session.')

    require('crypto').randomBytes(8, function(ex, buf) {
      var token = buf.toString('hex');

      module.exports.clients[token] = {
        connectTime : new Date()
      }

      res.writeHead(200, {
        'Content-Type' : 'application/javascript',
        'Set-Cookie': '__sjs=' + token
      })

      fn(token)
    })
  } else {
    // Serve files from existing session
    var token = cookies.__sjs

    res.writeHead(200, { 
      'Content-Type' : 'application/javascript' 
    })

    fn(token)
  }
  

  /**
   * Loading all the files and merg'em
   * @todo FUCKING CACHE!
   **/
  function fn( token ) {
    fs.readFile(socket_io_client, function(err, socket_io) {
      if (err) throw err

      fs.readFile(support_js_client, function(err, support_js) {
        if (err) throw err

        fs.readFile('public/templates/style.styl', function(err, tpl_style) {
          if (err) throw err

          stylus.render(tpl_style.toString(), function(err, tpl_style) {
            if (err) throw err

            fs.readFile('public/templates/tpl.html', function(err, tpl_html) {
              if (err) throw err

              // Parse options for client
              var opt = {
                token : token,
                path : process.env.SUP_PATH,
                tpl : {
                  css : tpl_style,
                  html : tpl_html.toString()
                }
              }

              // Fill our file with some pepper from the server
              var file = socket_io.toString() + support_js.toString()
              file = file.replace(':sjs_opt', JSON.stringify(opt))

              res.write(file)
              res.end()
            })
          })
        })
      })
    })
  }
})