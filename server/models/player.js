var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  name: { type: String, required: true },
  gameCount: Number,
  totalScore: Number,
  totalHands: Number,
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  wins: Number,
});

//Export model
module.exports = mongoose.model("Player", PlayerSchema);
