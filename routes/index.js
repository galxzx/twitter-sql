'use strict';
var express = require('express');
var router = express.Router();
//var tweetBank = require('../tweetBank');
var client = require('../db')

module.exports = function makeRouterWithSockets (io) {

var allTheTweets;



  // a reusable function
  function respondWithAllTweets (req, res, next){
    client.query('SELECT * FROM tweets INNER JOIN users ON tweets.user_id=users.id', function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
    //  console.log(tweets);
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    var user = req.params.username;
    client.query('SELECT * FROM tweets INNER JOIN users ON tweets.user_id=users.id WHERE name=$1', [user], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      //console.log(tweets);
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    var id = req.params.id;
    client.query('SELECT * FROM tweets INNER JOIN users ON tweets.user_id=users.id WHERE tweets.id=$1', [id], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
     // console.log(tweets);
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    //var newTweet = tweetBank.add(req.body.name, req.body.text);
    var user_id;
    client.query('SELECT * FROM users WHERE name = $1', [req.body.name], function(err, result){
        if(err) return next(err);

        if(!result.rows.length){
          client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [req.body.name], function(err, result){
            if(err) return next(err);
            console.log(result);
            user_id = result.rows[0].id;
            client.query('INSERT INTO tweets (user_id, content) VALUES ($1, $2) RETURNING *', [user_id, req.body.text], function (err, result) {
              if (err) return next(err); // pass errors to Express
              res.redirect('/');
            });
          })
        } else {
          user_id = result.rows[0].id;
          client.query('INSERT INTO tweets (user_id, content) VALUES ($1, $2) RETURNING *', [user_id, req.body.text], function (err, result) {
            if (err) return next(err); // pass errors to Express
            res.redirect('/');
          });
        }
    });
   // console.log(user_id);
    //var newTweet =

    //io.sockets.emit('new_tweet', newTweet);

  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
