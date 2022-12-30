require('dotenv').config();
var mongoose = require('mongoose');
var dev_db_url =
  'mongodb+srv://vercel-admin-user:bbhFGNyXnfW5FLdb@cluster0.qluf2.mongodb.net/et_bidding_game';
// var mongoDB = process.env.MONGODB_URI || dev_db_url;
var mongoDB = dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Game = require('./models/game');
var Player = require('./models/player');
var Count = require('./models/count');
Player.find().exec(function (err, players) {
  if (err) {
    console.log(err);
  }
  let bradley = players.filter((player) => player.name === 'BRADLEY')[0];
  let brad = players.filter((player) => player.name === 'BRAD')[0];

  Game.find()
    .sort({ _id: -1 })
    .populate('players')
    .exec(function (err, games) {
      if (err) {
        console.log(err);
      }
      brad.totalWins += 1;
      brad.save();
      // console.log(games[0].players);
      // console.log(games[0].players.some((player) => player.name === 'Brad'));
      console.log('done');
    });
});
