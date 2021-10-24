const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//Set up mongoose connection
var mongoose = require('mongoose');

require('dotenv').config(); 
var dev_db_url = process.env.MONGODB_URI;
// var mongoDB = process.env.MONGODB_URI || dev_db_url;
var mongoDB = dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// var Count = require('./models/count');
// const count = new Count({count: 0});
// count.save(function (err) {
//   if (err) return handleError(err);
//   console.log("saved count of ")
// })

var count = 0;


app.use(cors());

app.get('/count', (req,res) => {
  console.log("get count " + count);
  res.send({count: count})
})

app.post('/count', (req, res) => {
  console.log("post count " + count)
  count++;
  res.send({count: count});
})

app.get('/express_backend', (req, res) => { 
  res.send({ message: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 

app.listen(port, () => console.log(`Listening on port ${port}`));