const http = require('http');
const faye = require('faye');
const port = 3667;

let server = http.createServer(),
  bayeux = new faye.NodeAdapter({ mount: '/' });

bayeux.attach(server);
server.listen(port);

console.log('server listening at port: ', port);
