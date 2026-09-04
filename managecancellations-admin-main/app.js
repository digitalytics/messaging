// import express from 'express'
// import dotenv from 'dotenv'
// import path from 'path'

// const app = express();
// dotenv.config()

// app.use(express.static('dist'));
// app.get('*', function (req, res) {
//   res.sendFile(path.join(process.cwd(), "./dist", "index.html"));
// })
// app.listen(process.env.VITE_PORT, () => {
//   console.log('Server running on port', process.env.VITE_PORT);
// });



//Install express server
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.VITE_PORT || 8034;

const http = require('http');

app.use(express.static(__dirname + '/dist'));
app.get('/*', function (req, res) {
  return res.sendFile(path.join(__dirname + '/dist', 'index.html'));
})
const server = http.createServer(app);

// Start the app by listening on the default Heroku port
server.listen(port, (err, succ) => {
  if (err) {
    console.log('Error : ', err);
  } else {
    console.log('Express server listening on port ' + port);
  }
});
