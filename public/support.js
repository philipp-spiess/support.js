

!function($, opt) { 
  
  console.log(opt)

  var socket = io.connect(opt.path + '?token=' + opt.token)

  socket.on('foo', function (data) {
    console.log(data)
    socket.emit('bar', { my: 'data' })
  })

  $(function() {
    /**
     * Inject some html :9
     **/
     $('head').append('<style type="text/css">' + opt.tpl.css + '</style>')
     $('body').append(opt.tpl.html)


     $('#support-js button').click(function() {
        console.log('[support.js] Button Click')
        console.log(socket)
        socket.emit('support.js', {hello:'world'})
     })


  })

}(jQuery, :sjs_opt);