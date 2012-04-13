;

!function($, opt) { 
  
  console.log(opt)

  var socket = io.connect(opt.path + '?token=' + opt.token)

  $(function() {
    var send = function(message) {
      $('#support-js .chat').append('<li><strong>You:</strong><span>' + message + '</span></li>')
      $('#support-js textarea').val('')
      socket.emit('support.js', { message: message })
    }

    /**
     * Inject some html :9
     **/
     $('head').append('<style type="text/css">' + opt.tpl.css + '</style>')
     $('body').append(opt.tpl.html)

      // Hide registration is already registered
      if(typeof opt.client.user != 'undefined') {
        $('#support-js .register').hide()
        $('#support-js .chat').show()
      }

     $('#support-js button').click(function() {
      var name  = $('#support-js input[name="name"]').val(),
          email = $('#support-js input[name="email"]').val(),
          text  = $('#support-js textarea').val()

      if(text.length < 1) {
        alert('Please enter a text.')
      } else {
        if(typeof opt.client.user == 'undefined')  {   
          /**
           * If a user is not registered, we need to do it!
           **/
          if( name.length <= 3 || email.length <= 3 ) {
            // name and email must be set
            alert('Please enter a name and an email address.')
          } else {
            if(email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) == null) {
              alert('Your email is not valid.')
            } else {
              socket.emit('support.js:register', { name : name, email : email })
              socket.on('support.js:register', function(msg) {
                $('#support-js .register').hide()
                $('#support-js .chat').show()
                opt.client = msg.client
                send(text)
              })
            }
          }
        } else {
          /**
           * User seems to be registered
           **/
          send(text)
        }
      }
    })
  
    /**
     * Listen for answers ;)
     **/
    socket.on('support:js', function(msg) {
      $('#support-js .chat').append('<li><strong>' + msg.who + ':</strong><span>' + msg.message + '</span></li>')
      //console.log(msg)
    })
  })
}(jQuery, :sjs_opt);