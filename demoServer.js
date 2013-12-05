/**
 * A simple server for nodebotui
 **/

var 
  url = require('url'),
  send = require('send'),
  http = require('http'),
  
  app = http.createServer(function(req, res){
    var root = req.url.indexOf('nodebotui') !== -1 ? 'client/' : 'eg/';
    send(req, req.url).root(root).pipe(res);
  }),
  
  ui = require('./lib/nodebotui').listen(app);
  
app.listen(3000);

console.log("Server running at\n  => http://localhost:3000\nCTRL + C to shutdown");