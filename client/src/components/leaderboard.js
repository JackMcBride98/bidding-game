import React from "react";

function Leaderboard(props) {
  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
  };

  console.log("leaderboard re-render");

  return (
    <div className="border p-4 bg-white opacity-100 rounded-lg text-stone-900">
      {props.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <table className="">
          <thead>
            <tr className="">
              <th className="py-2 px-1"></th>
              <th className="py-2 px-4">Name</th>
              <th
                className="py-2 px-2 hover:cursor-pointer"
                onClick={() => props.handleSort("totalScore")}
              >
                Points
              </th>
              <th className="py-2 px-1">Games</th>
              <th
                className="py-2 px-1 hover:cursor-pointer"
                onClick={() => props.handleSort("wins")}
              >
                Wins
              </th>
              <th
                className="py-2 px-1 hover:cursor-pointer"
                onClick={() => props.handleSort("pph")}
              >
                PPH
              </th>
            </tr>
          </thead>
          <tbody>
            {props.players.map((player, index) => (
              <tr key={player.name} className="border-t">
                <th className="py-2 px-1">{index + 1} </th>
                <th className="font-normal">{formatName(player.name)}</th>
                <th className="font-normal">{player.totalScore}</th>
                <th className="font-normal">{player.gameCount}</th>
                <th className="font-normal">{player.wins}</th>
                <th className="font-normal">
                  {(player.totalScore / player.totalHands).toFixed(2)}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
