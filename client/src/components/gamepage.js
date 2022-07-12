import React, { useEffect } from 'react';
import RoundRow from '../components/roundRow';

function GamePage(props) {
  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
  };

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = '';
  };

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser, false);
    return () => {
      window.removeEventListener('beforeunload', alertUser, false);
    };
  });

  const highestScore = Math.max(...props.game.totalScores);

  return (
    <div
      id={props.game_id + 'gamepage'}
      className="grid justify-center justify-items-center gap-4 p-2"
    >
      <h1 className="text-4xl font-bold text-stone-900">
        Game #{props.game.number}
      </h1>
      <div className="flex justify-between w-full">
        <p className="text-stone-800 my-1 font-semibold">Location:</p>
        <p className="text-stone-800 my-1">{props.game.location}</p>
      </div>
      <div className="flex justify-between space-x-2 w-full">
        <p className="text-stone-800 my-1 font-semibold">Date:</p>
        <p className="text-stone-800 my-1">
          {new Date(props.game.date).toUTCString()}
        </p>
      </div>
      <div className="overflow-x-auto w-full text-sm">
        <table className="divide-y divide-black">
          <thead>
            <tr className="flex text-center w-full divide-x divide-black">
              <th key="Suits" className="w-9 pr-0.5 flex whitespace-nowrap">
                Suits
              </th>
              {props.game.unsortedPlayers.map((player) => (
                <th
                  key={player}
                  className="flex w-16 justify-center text-center"
                >
                  {formatName(player)}
                </th>
              ))}
              <th key="r0w"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {props.game.rounds.map((round, index) => (
              <RoundRow
                key={round.hands + round.suit + index}
                round={round}
                currentRound={99}
                index={index}
                roundBids={props.game.bids[index]}
                roundGets={props.game.gets[index]}
                roundScores={props.game.scores[index]}
                cumulativeScores={props.game.cumulativeScores[index]}
              />
            ))}
            <tr className="border-t border-black text-base flex divide-x divide-black">
              <td className="py-2 w-9 pr-0.5">Total</td>
              {props.game.totalScores.map((score, j) => (
                <td
                  key={j}
                  className={
                    'py-2 w-16 text-center ' +
                    (highestScore === score && 'bg-yellow-500')
                  }
                >
                  {score}
                </td>
              ))}
              <td></td>
            </tr>
            <tr className="border-t border-black text-base flex divide-x divide-black">
              <td className="py-2 w-9 pr-0.5">PPH</td>
              {props.game.totalScores.map((score, j) => (
                <td key={j} className="py-2 w-16 text-center">
                  {(score / props.game.rounds.length).toFixed(2)}
                </td>
              ))}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {props.children}
    </div>
  );
}

export default GamePage;
