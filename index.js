const express = require('express');
const app = express()
const exphbs = require('express-handlebars');
const bodyParser = require ('body-parser');

const redis = require('redis');
const bluebird = require('bluebird')
const redisClient = bluebird.promisifyAll(redis.createClient());
const superchat = require('./routes/superchat')
const server = require('http').createServer(app);
const io = require ('socket.io')(server);


const hbs = exphbs.create({
  defaultLayout: 'main'
});

app.locals.io = io

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.use(
  express.static(__dirname + '/public')
)
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/", superchat)

server.listen(4291, () => {
  console.log('lets get superchat up and running.')
})

/*
app.listen(4291, () => {
  console.log('you can do it!!!')
})
*/
