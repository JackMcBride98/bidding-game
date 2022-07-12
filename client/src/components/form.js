import React, { useState } from 'react';

function Form({ handleSubmit }) {
  const [rounds, setRounds] = useState(10);
  const [randomiseSuits, setRandomiseSuits] = useState(false);
  const [upAndDown, setUpAndDown] = useState(false);
  const [bonusRound, setBonusRound] = useState(true);
  const [players, setPlayers] = useState(['Jack', 'Bradley', 'Matt', 'Liam']);
  const [location, setLocation] = useState('GG');

  const onSubmit = (event) => {
    event.preventDefault();
    let errors = formValidate();
    if (Object.keys(errors).length === 0) {
      handleSubmit({
        rounds: parseInt(rounds),
        randomiseSuits: randomiseSuits,
        upAndDown: upAndDown,
        bonusRound: bonusRound,
        players: players,
        location: location,
      });
    } else {
      alert(Object.keys(errors).map((err, index) => errors[err]));
    }
  };

  const formValidate = () => {
    let errors = {};
    if (!Number.isInteger(parseInt(rounds))) {
      errors.rounds = 'Rounds must be an Integer';
    }
    if (parseInt(rounds) < 2) {
      errors.rounds = 'Rounds must be greater than 1';
    }
    if (parseInt(rounds) * players.length > 52) {
      errors.rounds =
        'Rounds multiplied by players must be less than 52 (the number of cards in the deck)';
    }
    if (typeof upAndDown !== 'boolean') {
      errors.upAndDown = 'UpAndDown must be a boolean';
    }
    if (typeof bonusRound !== 'boolean') {
      errors.bonusRound = 'UpAndDown must be a boolean';
    }
    if (typeof randomiseSuits !== 'boolean') {
      errors.bonusRound = 'RandomiseSuits must be a boolean';
    }
    players.forEach((player) => {
      if (!player) {
        errors.players = 'Player Name must not be empty';
      }
    });
    if (!location) {
      errors.location = 'location must not be empty';
    }
    let noDups = new Set(players.map((player) => player.trim().toLowerCase()));
    if (noDups.size !== players.length) {
      errors.playerDuplicates = 'No duplicate names';
    }
    if (players.length < 2) {
      errors.playerCount = 'Must have at least two players';
    }
    return errors;
  };

  return (
    <div className="grid justify-center justify-items-center gap-4 text-lg text-stone-900">
      <p className="text-4xl text-stone-900">FORM</p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col space-y-4 border-black border rounded-lg p-4"
      >
        <label className="">
          Number of Rounds:
          <input
            className="ml-4 border-stone-900 border rounded-lg px-1 w-16 text-2xl"
            type="number"
            value={rounds}
            onChange={(e) => {
              e.preventDefault();
              if (
                true
                // e.target.value > 1 &&
                // e.target.value * players.length <= 52 &&
                // !e.target.value.includes(".")
              ) {
                setRounds(e.target.value);
              }
            }}
          />
        </label>
        <label>
          Randomise Suits:
          <input
            className="ml-4 w-4 h-4"
            type="checkbox"
            style={{ accentColor: '#ec4899' }}
            checked={randomiseSuits}
            onChange={(e) => setRandomiseSuits(!randomiseSuits)}
          />
        </label>
        <label>
          Up and Down:
          <input
            className="ml-4 w-4 h-4"
            style={{ accentColor: '#ec4899' }}
            type="checkbox"
            checked={upAndDown}
            onChange={(e) => setUpAndDown(!upAndDown)}
          />
        </label>
        <label>
          Bonus Round:
          <input
            className="ml-5 w-4 h-4"
            type="checkbox"
            style={{ accentColor: '#ec4899' }}
            checked={bonusRound}
            onChange={(e) => setBonusRound(!bonusRound)}
          />
        </label>
        {players.map((player, i) => (
          <label key={i}>
            Player {i + 1}:
            <input
              className="border ml-2 px-1 rounded-lg"
              type="text"
              value={players[i]}
              onChange={(e) => {
                e.preventDefault();
                if (!e.target.value.includes(' ')) {
                  let newArr = [...players];
                  newArr[i] = e.target.value;
                  setPlayers(newArr);
                }
              }}
            />
          </label>
        ))}
        <div className="flex justify-evenly">
          <button
            onClick={(e) => {
              e.preventDefault();
              let newArr = [...players];
              newArr.push('');
              setPlayers(newArr);
            }}
            className="p-2 border-black border rounded-lg bg-gray-100"
          >
            Add Player{' '}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              let newArr = [...players];
              newArr.pop();
              setPlayers(newArr);
            }}
            className="p-2 border-black border rounded-lg bg-gray-100"
          >
            Remove Player{' '}
          </button>
        </div>
        <label>
          Location:
          <input
            className="ml-2 px-1 border rounded-lg"
            type="text"
            value={location}
            onChange={(e) => {
              e.preventDefault();
              setLocation(e.target.value);
            }}
          />
        </label>

        <input
          type="submit"
          value="submit"
          className="rounded-lg border border-black p-2 hover:cursor-pointer"
        />
      </form>
      <div>{}</div>
    </div>
  );
}

export default Form;
