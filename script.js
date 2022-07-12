var mongoose = require('mongoose');

require('dotenv').config();
var dev_db_url = process.env.MONGODB_URI;
// var mongoDB = process.env.MONGODB_URI || dev_db_url;
var mongoDB = dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Game = require('./server/models/game');
var Player = require('./server/models/player');
var Count = require('./server/models/count');

Game.findOne()
  .sort({ field: 'asc', _id: -1 })
  .limit(1)
  .exec({}, function (err, game) {
    var cardiffGame = game;
    Player.findOne({ name: 'TOM' }, function (err, player) {
      if (err) {
        console.log(err);
      }
      var tom = player;

      tom.games.push(cardiffGame);
      tom.gameCount++;
      tom.totalScore += 126;
      tom.totalHands += 11;
      tom.wins++;
      tom.save(function (err) {
        if (err) {
          console.log(err);
        }
        //saved
        console.log('saved');
        Player.findOne({ name: 'TOM' }, function (err, player) {
          if (err) {
            console.log(err);
          }
          console.log(player);
        });
      });
    });
  });

// Game.find()
//   .sort({ _id: -1 })
//   .populate('players')
//   .exec(function (err, games) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(games);
//   });
