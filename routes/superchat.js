/*
const express = require('express');
const app = express()
const router = express.Router();
const bodyParser = require('body-parser');
const functions = require("../services/functions");
const bluebird = require('bluebird')
const redis = bluebird.promisifyAll(require('redis'));

//const redisClient = bluebird.promisifyAll(redis.createClient());
const redisClient = redis.createClient();

//const server = require('http').createServer(app);
//const io = require('socket.io')(server);
*/
const express = require('express')
const app = express();
const router = express.Router();
const functions = require('../services/functions')
const bodyParser = require('body-parser')
const bluebird = require('bluebird')
const redis = bluebird.promisifyAll(require('redis'));
// const redis = require('redis')
const redisClient = redis.createClient();

//bluebird.promisifyAll(redis) //was createServer
//const server = require('http').createServer(app); //we normally dont have to create server with express.
//const io = require('socket.io')(server);


router.get('/', (req, res) => {
  redisClient.keysAsync('*').then((keys, err) => {
      if (err) {
        console.log(err)
      }
      return keys
    }).then(functions.messagesResolver)

    .then((messages) => {
      //console.log(messages)
      res.render("warmup", {
        messages: messages
      })
    })
})


router.post('/', (req, res) => {
  var post = req.body.post
  //var room = req.body.room
  let io = req.app.locals.io
  let code = "message" + functions.randomCodeGen()

  if (post) {
    redisClient.hset(code, 'body', post, 'room', 'cats', 'author', 'anon')
    //.then(result => {
    var data = {
      body: post
    }
    io.emit('new post', data)
  }

  //}


  //redisClient.flushall()


  //res.redirect('back')

});


module.exports = router
