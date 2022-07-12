import Form from './form';
import RoundRow from './roundRow';
import React, { useState, useEffect } from 'react';

function Scoreboard({ submitGame, setAppView }) {
  const [view, setView] = useState('form');
  const [gameData, setGameData] = useState({});
  const suits = ['♥', '♠', '♦', '♣', '×'];
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundBids, setRoundBids] = useState([]);
  const [roundGets, setRoundGets] = useState([]);
  const [roundScores, setRoundScores] = useState([]);
  const [cumulativeScores, setCumulativeScores] = useState([]);
  const [bidsDone, setBidsDone] = useState(false);
  const [addToLeaderboard, setAddToLeaderboard] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = '';
  };

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const handleSubmit = (gameData) => {
    setGameData(gameData);
    let theRounds = [];
    if (gameData.randomiseSuits) {
      shuffle(suits);
    }
    let suitPlaceholder = [...suits];

    for (let i = gameData.rounds; i > 0; i--) {
      theRounds.push({ hands: i, suit: suitPlaceholder.pop() });
      if (suitPlaceholder.length === 0) {
        suitPlaceholder = [...suits];
      }
    }
    if (gameData.bonusRound) {
      theRounds.push({ hands: 1, suit: 'B' });
    }
    if (gameData.upAndDown) {
      for (let i = 1; i < gameData.rounds; i++) {
        theRounds.push({ hands: i + 1, suit: suitPlaceholder.pop() });
        if (suitPlaceholder.length === 0) {
          suitPlaceholder = [...suits];
        }
      }
    }
    setRounds(theRounds);
    setRoundBids(
      new Array(theRounds.length)
        .fill(0)
        .map(() => new Array(gameData.players.length).fill(0))
    );
    setRoundGets(
      new Array(theRounds.length)
        .fill(0)
        .map(() => new Array(gameData.players.length).fill(0))
    );
    setRoundScores(
      new Array(theRounds.length)
        .fill(0)
        .map(() => new Array(gameData.players.length).fill(0))
    );
    setCumulativeScores(
      new Array(theRounds.length)
        .fill(0)
        .map(() => new Array(gameData.players.length).fill(0))
    );
    setView('scoreboard');
  };

  const handleBidsDone = () => {
    let bidsSum = roundBids[currentRound].reduce((a, b) => a + b, 0);
    if (bidsSum === rounds[currentRound].hands) {
      alert(
        'Bids Total(' +
          bidsSum +
          ') cannot equal number of hands(' +
          rounds[currentRound].hands +
          ')'
      );
    } else {
      setBidsDone(true);
    }
  };

  const handleGetsDone = () => {
    let getsSum = roundGets[currentRound].reduce((a, b) => a + b, 0);
    if (getsSum === rounds[currentRound].hands) {
      let arr = [...roundScores];
      for (let i = 0; i < arr[currentRound].length; i++) {
        arr[currentRound][i] =
          roundGets[currentRound][i] * 2 +
          (roundBids[currentRound][i] === roundGets[currentRound][i] ? 10 : 0);
      }
      setRoundScores(arr);

      arr = [...cumulativeScores];
      arr[currentRound] = arraySum(roundScores.slice(0, currentRound + 1));
      setCumulativeScores(arr);
      setCurrentRound(currentRound + 1);
      setBidsDone(false);
    } else {
      alert(
        'Gets total(' +
          getsSum +
          ') must equal number of hands(' +
          rounds[currentRound].hands +
          ')'
      );
    }
  };

  const handleBidsChange = (e, i) => {
    if (e === '+') {
      let arr = [...roundBids];
      arr[currentRound][i] = arr[currentRound][i] + 1;
      setRoundBids(arr);
    }
    if (e === '-') {
      if (roundBids[currentRound][i] > 0) {
        let arr = [...roundBids];
        arr[currentRound][i] = arr[currentRound][i] - 1;
        setRoundBids(arr);
      }
    }
  };

  const handleGetsChange = (e, i) => {
    if (e === '+') {
      let arr = [...roundGets];
      arr[currentRound][i] = arr[currentRound][i] + 1;
      setRoundGets(arr);
    }
    if (e === '-') {
      if (roundGets[currentRound][i] > 0) {
        let arr = [...roundGets];
        arr[currentRound][i] = arr[currentRound][i] - 1;
        setRoundGets(arr);
      }
    }
  };

  const handleUndo = () => {
    if (bidsDone) {
      setBidsDone(false);
    } else {
      if (currentRound > 0) {
        setCurrentRound(currentRound - 1);
        setBidsDone(true);
      }
    }
  };

  const arraySum = (array) => {
    if (array.length === 1) {
      return array[0];
    }
    let newArray = new Array(array[0].length).fill(0);
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        newArray[j] += array[i][j];
      }
    }
    return newArray;
  };

  if (view === 'form') {
    return (
      <div className="flex flex-col items-center">
        <Form handleSubmit={handleSubmit} />
        <button
          onClick={(e) => {
            setAppView('home');
          }}
          className="border border-black rounded-lg p-2 bg-white mb-6 text-stone-900 text-lg"
        >
          Back to Home
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex w-max flex-col text-sm overflow-x-auto p-1 mx-auto">
        {/* <p>Location: {gameData.location}</p> */}
        <table className="mb-5 divide-y divide-black border-collapse">
          <thead>
            <tr className="flex text-center divide-x divide-black">
              <th key="Suits" className="flex whitespace-nowrap w-9">
                <p className="w-full"> Suits</p>
              </th>
              {gameData.players.map((player) => (
                <th
                  key={player}
                  className="flex w-16 text-center justify-center"
                >
                  <p className="text-center"> {player}</p>
                </th>
              ))}
              <th key="r0w" className="flex w-18">
                <p className=""></p>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {rounds.map((round, index) => (
              <RoundRow
                key={round.hands + round.suit + index}
                round={rounds[index]}
                currentRound={currentRound}
                index={index}
                roundBids={roundBids[index]}
                roundGets={roundGets[index]}
                roundScores={roundScores[index]}
                bidsDone={bidsDone}
                handleBidsDone={handleBidsDone}
                handleGetsDone={handleGetsDone}
                handleBidsChange={handleBidsChange}
                handleGetsChange={handleGetsChange}
                cumulativeScores={cumulativeScores[index]}
                handleUndo={handleUndo}
              />
            ))}
          </tbody>
        </table>
        {currentRound >= rounds.length ? (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => handleUndo()}
              className="border border-black rounded-lg text-xs p-1"
            >
              {' '}
              Undo{' '}
            </button>
            <label className="border p-2 rounded-lg w-max">
              Add to Leaderboard
              <input
                className="text-lg text-stone-900 ml-4 w-4 h-4"
                type="checkbox"
                checked={addToLeaderboard}
                onChange={() => setAddToLeaderboard(!addToLeaderboard)}
              />
            </label>
            {isSubmitting ? (
              <p>Submitting game ...</p>
            ) : (
              <button
                onClick={() => {
                  setIsSubmitting(true);
                  submitGame(
                    gameData,
                    rounds,
                    roundBids,
                    roundGets,
                    roundScores,
                    cumulativeScores[rounds.length - 1],
                    addToLeaderboard
                  );
                }}
                className="rounded-lg border border-black p-2 w-max"
              >
                Submit Game!
              </button>
            )}
          </div>
        ) : isSubmitting ? (
          <p>Submitting game... </p>
        ) : (
          <div className="flex flex-col items-center mb-4 space-y-4 mt-80">
            <label className="border p-2 rounded-lg w-max">
              Add to Leaderboard
              <input
                className="text-lg text-stone-900 ml-4 w-4 h-4"
                type="checkbox"
                checked={addToLeaderboard}
                onChange={() => setAddToLeaderboard(!addToLeaderboard)}
              />
            </label>
            <button
              onClick={() => {
                if (
                  currentRound !== 0 &&
                  window.confirm(
                    '🤔Are you sure you want to submit the game early🤔?\n(Add To leaderboard === ' +
                      addToLeaderboard +
                      ' )'
                  )
                ) {
                  setIsSubmitting(true);
                  submitGame(
                    gameData,
                    rounds.slice(0, currentRound),
                    roundBids.slice(0, currentRound),
                    roundGets.slice(0, currentRound),
                    roundScores.slice(0, currentRound),
                    cumulativeScores[currentRound - 1],
                    addToLeaderboard
                  );
                }
              }}
              className="rounded-lg border border-black p-2 w-max"
            >
              Submit game early?
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Scoreboard;
