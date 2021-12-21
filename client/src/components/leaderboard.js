import React from "react";

function Leaderboard(props) {
  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
  };

  return (
    <div className="border p-4 bg-white opacity-100 rounded-lg text-stone-900">
      {props.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <table className="">
          <thead>
            <tr className="">
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Points</th>
              <th className="py-2 px-4">Games</th>
              <th className="py-2 px-4">PPH</th>
            </tr>
          </thead>
          <tbody>
            {props.players.map((player, index) => (
              <tr key={player.name} className="border-t">
                <th className="py-2 px-4">{index + 1} </th>
                <th className="font-normal">{formatName(player.name)}</th>
                <th className="font-normal">{player.totalScore}</th>
                <th className="font-normal">{player.gameCount}</th>
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
