const app = require('express')();
const redis = require('redis');
const bluebird = require('bluebird');
const redisClient = bluebird.promisifyAll(redis.createClient());
const functions = {};




functions.randomCodeGen = () => {
  var randomCharStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIKJLMNOPQRSTUVWXYZ0123456789'
  var randomCode = ''
  for (var i = 0; i < 6; i++) {
    randomCode += randomCharStr[Math.floor(Math.random() * randomCharStr.length)]
  }
  return randomCode
}

functions.messagesResolver = (keys) => {
  return new Promise((resolve, reject) => {
    var messageInfo = []
    for (let key of keys) {
      messageInfo.push(Promise.resolve(
        redisClient.hgetallAsync(key).then((hashData) => {
          //let messages = []
          return {
            body: hashData.body,
            author: hashData.author,
            room: hashData.room,
          }
          //messages.push(data)
          //console.log(data)

        })
      ))
    }
    Promise.all(messageInfo).then(messages => {
      resolve(messages)
    })
  })
}

module.exports = functions
