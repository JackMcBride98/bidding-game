import Form from './form'
import React, {useState} from 'react'

function Scoreboard(){

  const [view, setView] = useState("form");
  const [gameData, setGameData] = useState({});
  const suits = ["♥", "♠", "♦", "♣", "×"];

  const handleSubmit = (gameData) => {
    setGameData(gameData);
    setView("scoreboard");
  }

  if(view ==="form"){
    return (
      <Form handleSubmit={handleSubmit} />
    )
  }
  else {
    console.log(gameData)
    // generate rounds
    const rounds = [];
    for (let i = gameData.rounds; i>0; i--){
      rounds.push(i + suits[(gameData.rounds-i)%5]);
    }
    if (gameData.upAndDown) {
      for (let i = 0; i < gameData.rounds; i++){
        rounds.push((i+1) + suits[i%5]);
      }
    }
    if (gameData.bonusRound) {
      rounds.push("1B");
    }
    console.log(rounds);

    return(
      <div>
        <p>This is the scoreboard.</p>
        <table>
          <thead>
            <tr> 
              <th>Suits</th>
            {gameData.players.map((player) => (
                <th>{player}</th>
            ))}
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => (
              <tr>
                <td>{round}</td>
                {gameData.players.map(() => (
                  <td></td>
                ))}
              </tr> 
            ))}

          </tbody>
        </table>
      </div>
    )
  }
}

export default Scoreboard