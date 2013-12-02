/**
 * The simplest possible server for nodebotui
 **/

var app = require('http').createServer(),
  ui = require('./lib/nodebotui').listen(app);
  
app.listen(3000);

console.log("Server running at\n  => http://localhost:3000\nCTRL + C to shutdown");