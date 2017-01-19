'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var makesRouter = require('./routes');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var bodyParser = require('body-parser');
//var socketio = require('socket.io');

// templating boilerplate setup
app.engine('html', nunjucks.render); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
nunjucks.configure('views', { noCache: true }); // where to find the views, caching off

/* logging middleware
 *  morgan('dev') = function (req, res, next) {
 *    console.log('logging info');
 *    next();
 *  }
*/
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

/** a typical pattern for organizing middleware
 *
 * configuration middleware
 *  loggers, parsers, authentication middleware
 *
 * your routes
 *
 * error-handling 'endware' i.e. middleware that comes at the end ;)
 *  handling 404 not found, and also 500 server errors
*/

// start the server

//var server =
app.listen(1337, function(){
  console.log('listening on port 1337');
});
//var io = socketio.listen(server);

app.use(express.static(path.join(__dirname, '/public')));

// modular routing that uses io inside it
app.use('/', makesRouter());

// // manually-written static file middleware
// app.use(function(req, res, next){
//   var mimeType = mime.lookup(req.path);
//   fs.readFile('./public' + req.path, function(err, fileBuffer){
//     if (err) return next();
//     res.header('Content-Type', mimeType);
//     res.send(fileBuffer);
//   });
// });
