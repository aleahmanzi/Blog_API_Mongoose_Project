const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const blogPostRouter = require('./blogPostRouter');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {blogPost} = require('./models');

const app = express();
const jsonParser = bodyParser.json();

//// BEGIN OPTIONS ////
app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log("--NEW REQUEST--");
  console.log(req.method, " ", req.path);
  next();
  req.body.hello = "HELLO";
  console.log("body at app level ", req.body);
});
let userRouter = require('./userRouter');
console.log("user router ", userRouter);
/// routes for "Router"
app.use('/blogPost', blogPostRouter);
app.use('/user', userRouter);


///// END OPTIONS /////

let server;

// run the server

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// close the server

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}


if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};