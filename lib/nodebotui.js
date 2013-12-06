var socketio = require('socket.io'),
  _ = require("underscore")._,
  five = require("johnny-five"),
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
     
      // If a board by this name already exists
      if (nodebotui[opts.id]) {
        
        // Make sure all the devices passed within this board object exist
        _.each(opts, function(device, key) {
          if (typeof nodebotui[opts.id][device.id] === 'undefined' && key !== 'id' && key !== 'device-type' && key.substring(0,1) !== '_') {
           device._j5 = new five[device["device-type"]](device);
           nodebotui[opts.id][device.id] = device;
          }
        });
          
        // Let the client know we are ready
        socket.emit('board ready', {"id": opts.id});
        console.log('new client');
      
      } else {
      
        nodebotui[opts.id] = opts;
      
        nodebotui[opts.id]._j5 = new five.Board();
        
        nodebotui[opts.id]._j5.on("ready", function() {
          
          // Initialize all the devices passed within this board object
          _.each(nodebotui[opts.id], function(device, key) {
            if (key !== 'id' && key !== 'device-type' && key.substring(0,1) !== '_') {
             device._j5 = new five[device["device-type"]](device);
            }
          });
          
          // Let the client know we are ready
          socket.emit('board ready', {"id": opts.id});
          console.log('board ready');
        });
      
      }
      
      
    });
    
    // The client has called a method
    socket.on('call', function (opts) {
      var device = nodebotui[opts.board][opts.device]._j5;
      if (device) {
        device[opts.method](opts.params);
      }
    });
      
  });
    
  return nodebotui;
}
