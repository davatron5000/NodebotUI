var socketio = require('socket.io'),
  _ = require("underscore")._,
  five = require("johnny-five"),
  send = require("send"),
  nodebotui = {};
  
  
/**
 * listen
 *
 * @param {http.Server} app
 */
module.exports.listen = function(app) {
  
  io = socketio.listen(app);
  
  io.sockets.on('connection', function (socket) {
    
    /**
     * initialize a new johnny-five board
     * @param {object} opts
     *
     * eg:  { _element: 'sampleBoard',
     *        myled: { 
     *           _board: 'sampleBoard',
     *          _element: 'myled',
     *          pin: '13',
     *          dataDeviceType: 'Led',
     *          min: 0,
     *          max: 255
     *        }
     *      }
     */
     socket.on('new board', function (opts) {
     
      nodebotui[opts._element] = opts;
      nodebotui[opts._element]._j5 = new five.Board(opts);
      
      nodebotui[opts._element]._j5.on("ready", function() {
        
        // Initialize all the devices passed within this board object
        _.each(opts, function(device, key) {
          if (key.substring(0,1) !== '_') {
           device._j5 = new five[device.dataDeviceType](device);
          }
        }, nodebotui[opts._element]);
        
        // Let the client know we are ready
        socket.emit('board ready', {"id": opts._element});
      });
    });
    
    // The client has called a method
    socket.on('call', function (opts) {
      var device = nodebotui[opts.board][opts.device]._j5;
      device[opts.method](opts.params);
    });
      
  });
  
  app.on('request', function(req, res) {
    if (0 == req.url.indexOf('/nodebotui/nodebotui-client.js')) {
      var path = 'nodebotui-client.js';
      send(req, path).root(__dirname+'/../client/').pipe(res);
    }
  });
  
  return nodebotui;
}
