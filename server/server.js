const express = require("express");
const cors = require("cors");
const async = require("async");
_ = require("underscore");
const path = require("path");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());

var Game = require("./models/game");
var Player = require("./models/player");
var Count = require("./models/count");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../client/build")));

//Set up mongoose connection
var mongoose = require("mongoose");

require("dotenv").config();
var dev_db_url = process.env.MONGODB_URI;
// var mongoDB = process.env.MONGODB_URI || dev_db_url;
var mongoDB = dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Clear Database
// Player.deleteMany({}, function (err) {
//   if (err) {
//     console.log(err);
//   }
//   console.log("All players deleted");
// });
// Game.deleteMany({}, function (err) {
//   if (err) {
//     console.log(error);
//   }
//   console.log("All games deleted");
// });
// Count.deleteMany({}, function (err) {
//   if (err) {
//     console.log(err);
//   }
//   console.log("Count deleted");
//   let first = new Count({ count: 0 });
//   first.save(function (err) {
//     if (err) {
//       console.log(err);
//     }
//     console.log("saved new count");
//     console.log(first);
//   });
// });

app.use(cors());

let count;

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.get("/count", (req, res) => {
  // console.log("get count " + count);

  if (!count) {
    Count.find().exec(function (err, savedCount) {
      if (err) {
        console.log(err);
      }
      count = savedCount[0];
      res.send({ count: count.count });
    });
  } else {
    res.send({ count: count.count });
  }
});

app.post("/count", (req, res) => {
  // console.log("post count " + count);
  if (count) {
    count.count = count.count + 1;
    count.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.send({ count: count.count });
    });
  } else {
    res.send({ count: 0 });
  }
});

app.get("/players", (req, res) => {
  // console.log("request for players made");
  Player.find({}).exec(function (err, players) {
    if (err) {
      console.log(err);
    }
    res.send(players);
  });
});

app.get("/recentGames", (req, res) => {
  Game.find()
    .sort({ _id: -1 })
    .limit(5)
    .populate("players")
    .exec(function (err, games) {
      if (err) {
        console.log(err);
      }

      res.send(games);
    });
});

app.get("/allGames", (req, res) => {
  Game.find()
    .sort({ _id: -1 })
    .populate("players")
    .exec(function (err, games) {
      if (err) {
        console.log(err);
      }

      res.send(games);
    });
});

app.post("/game", (req, res) => {
  // console.log("game posted");
  // console.log(req.body);
  //save game to database
  //find or create players
  let players = req.body.players;
  players = players.map((player) => player.trim().toUpperCase());
  // console.log(players);

  async.forEachOf(
    players,
    function iteratee(name, index, callback) {
      Player.findOne({ name: name }, function (err, player) {
        if (err) {
          console.log(err);
        }
        if (!player) {
          player = new Player({
            name: name,
            gameCount: 0,
            totalScore: 0,
            totalHands: 0,
            games: [],
          });
          // player.save();
        }
        players[index] = player;
        callback();
      });
    },
    function callback(err) {
      if (err) {
        console.log(err);
      }
      // once we have found or created all the players from the game in the database, we can create the game
      // console.log(players);
      // console.log(req.body);
      // var newGameObject = Object.create(req.body);
      // newGameObject.players = players;
      // console.log({newGameObject})
      var newGame = new Game(_.extend(req.body));
      newGame.players = players;
      if (req.body.addToLeaderboard) {
        players.forEach(async (player, i) => {
          player.gameCount = player.gameCount + 1;
          player.totalScore = player.totalScore + newGame.totalScores[i];
          player.totalHands = player.totalHands + newGame.rounds.length;
          player.games.push(newGame._id);
          player.save(function (err) {
            if (err) {
              console.log(err);
            }
            //saved
          });
        });
      }
      Game.countDocuments({}, function callback(err, count) {
        if (err) {
          console.log(err);
        }
        newGame.number = count + 1;
        newGame.save(function (err) {
          if (err) {
            console.log(err);
            res.send({ err });
          } else {
            res.send("Success");
          }
        });
      });
    }
  );
});

app.get("/express_backend", (req, res) => {
  res.send({ message: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
