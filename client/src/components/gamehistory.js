import React from "react";

function GameHistory(props) {
  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
  };

  return (
    <div className="w-full opacity-80">
      {props.isLoading ? (
        <p>Loading ...</p>
      ) : (
        props.games.map((game, j) => (
          <div
            key={game._id}
            className="bg-white my-4 p-4 border rounded-lg text-stone-900 grid"
          >
            <h1 className="font-semibold text-center text-lg mb-3 text-stone-900">
              Game #{game.number}
            </h1>
            <div className="flex justify-between">
              <p className="text-stone-800 my-1 font-semibold">Location:</p>
              <p className="text-stone-800 my-1">{game.location}</p>
            </div>
            <div className="flex justify-between space-x-2">
              <p className="text-stone-800 my-1 font-semibold">Date:</p>
              <p className="text-stone-800 my-1">
                {new Date(game.date).toUTCString()}
              </p>
            </div>
            <div className="flex justify-between ">
              <p className="text-stone-800 my-1 font-semibold">
                Number of Rounds:
              </p>
              <p className="text-stone-800 my-1">{game.rounds.length}</p>
            </div>
            <table
              key={game._id + "table"}
              className="w-full text-left text-stone-900 mt-4"
            >
              <thead>
                <tr>
                  <th className="py-2 px-4"></th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Points</th>
                </tr>
              </thead>
              <tbody>
                {game.players.map((player, index) => (
                  <tr key={player._id} className="border-t">
                    <td className="py-2 px-4 font-bold">{index + 1}</td>
                    <td className="py-2 px-4">{formatName(player.name)}</td>
                    <td className="py-2 px-4">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => props.handleMoreInfo(game)}
              className="border border-black rounded-lg p-2 bg-white w-max justify-self-center mt-4"
            >
              More Info
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default GameHistory;
