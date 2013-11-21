var nodebotui = (function () {

  var socket, boards;
  
  // @include Board.js
  
  // @include Input.js
  
  // @include deviceTypes.js
  
  // @include deviceMethods.js
  
  // @include inputTypes.js
  
  // @include underscoreFunctions.js
   
  /**
   * Loop through the forms in the web page. For each one that has a 
   * data-device-type attribute set to "board" we are defining a
   * a new board to pass to Johnny-Five
   */
  function _getBoards() {
    
    var boards = {}, forms = document.getElementsByTagName ('form'), i;
    
    for (i = 0; i < forms.length; i++) {
      if (forms[i].getAttribute('data-device-type') === 'board') {
        boards[forms[i].id] = new Board({ 'element': forms[i].id});
        
        // tell the server to initialize our new board
        socket.emit('new board', boards[forms[i].id] );
      }
    }
    
    return boards;
  }
  
  /**
   * This bit loads the socket.io client script asynchronously
   * and then fires our _getBoards function
   **/
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;

  /**
   * Find the src for this script so we can request socket.io 
   * from the same server
   **/
  var scripts = document.getElementsByTagName('script'), len = scripts.length, re = /nodebotui-client\.js$/, src, nbuiScriptSrc;
  while (len--) {
    src = scripts[len].src;
    if (src && src.match(re)) {
      nbuiScriptSrc = src;
      break;
    }
  }
  
  script.onload = function(){

      socket = io.connect(nbuiScriptSrc.replace('/nodebotui/nodebotui-client.js', ''));

      //Initialize boards
      boards =  _getBoards();
      
      // This is where we listen for events from the server
      socket.on('board ready', function( opts ) {
        boards[opts.id]._ready = true;
        boards[opts.id].initialize();
        console.log('board ready');
      });
      
      // assign our boards object to nodebotui global
      return boards;
  };

  // Insert script element for socket.io
  script.src = nbuiScriptSrc.replace('nodebotui/nodebotui-client.js', 'socket.io/socket.io.js');
  document.getElementsByTagName('head')[0].appendChild(script);
   
})();