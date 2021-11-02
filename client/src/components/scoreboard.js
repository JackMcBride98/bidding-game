import Form from './form'
import RoundRow from './roundRow';
import React, {useState} from 'react'

function Scoreboard({submitGame}){

  const [view, setView] = useState("form");
  const [gameData, setGameData] = useState({});
  const suits = ["♥", "♠", "♦", "♣", "×"];
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundBids, setRoundBids] = useState([]);
  const [roundGets, setRoundGets] = useState([]);
  const [roundScores, setRoundScores] = useState([]);
  const [cumulativeScores, setCumulativeScores] = useState([]);
  const [bidsDone, setBidsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (gameData) => {
    setGameData(gameData);
    let theRounds = [];
    for (let i = gameData.rounds; i>0; i--){
      theRounds.push({hands: i, suit: suits[(gameData.rounds-i)%5] });
    }
    if (gameData.upAndDown) {
      for (let i = 0; i < gameData.rounds; i++){
        theRounds.push({hands:(i+1), suit: suits[i%5]});
      }
    }
    if (gameData.bonusRound) {
      theRounds.push({hands: 1, suit: "B"});
    }
    setRounds(theRounds);
    setRoundBids(new Array(theRounds.length).fill(0).map(() => new Array(gameData.players.length).fill(0)));
    setRoundGets(new Array(theRounds.length).fill(0).map(() => new Array(gameData.players.length).fill(0)));
    setRoundScores(new Array(theRounds.length).fill(0).map(() => new Array(gameData.players.length).fill(0)));
    setCumulativeScores(new Array(theRounds.length).fill(0).map(() => new Array(gameData.players.length).fill(0)));
    setView("scoreboard");
  }

  const handleBidsDone = () => {
    let bidsSum = roundBids[currentRound].reduce((a, b) => a + b, 0);
    if (bidsSum === rounds[currentRound].hands){
      setErrorMessage("Bids Total(" + bidsSum + ") cannot equal number of hands(" + rounds[currentRound].hands + ")")
    }
    else {
      setBidsDone(true);
    }
  }

  const handleGetsDone = () => {
    let getsSum = roundGets[currentRound].reduce((a, b) => a + b, 0);
    if (getsSum === rounds[currentRound].hands){
      let arr = [...roundScores]
      for (let i = 0; i < arr[currentRound].length; i++){
        arr[currentRound][i] = roundGets[currentRound][i]*2 + (roundBids[currentRound][i]===roundGets[currentRound][i]?10:0);
      }
      setRoundScores(arr);

      arr = [...cumulativeScores]
      arr[currentRound] = arraySum(roundScores.slice(0,currentRound+1))
      setCumulativeScores(arr);
      setCurrentRound(currentRound+1);
      setBidsDone(false);
    }
    else {
      setErrorMessage("Gets total(" + getsSum + ") must equal number of hands(" +rounds[currentRound].hands + ")");
    }

  }

  const handleBidsChange = (e, i) => {
    setErrorMessage("");
    if (e==='+'){
      let arr = [...roundBids];
      arr[currentRound][i] = arr[currentRound][i] + 1;
      setRoundBids(arr);
    }
    if (e==='-'){
      let arr = [...roundBids];
      arr[currentRound][i] = arr[currentRound][i] - 1;
      setRoundBids(arr);
    }
  }

  const handleGetsChange = (e, i) => {
    setErrorMessage("");
    if (e==='+'){
      let arr = [...roundGets];
      arr[currentRound][i] = arr[currentRound][i] + 1;
      setRoundGets(arr);
    }
    if (e==='-'){
      let arr = [...roundGets];
      arr[currentRound][i] = arr[currentRound][i] - 1;
      setRoundGets(arr);
    }
  }

  const handleUndo = () => {
    if (bidsDone){
      setBidsDone(false);
    }
    else {
      if (currentRound > 0){
        setCurrentRound(currentRound-1);
        setBidsDone(true);
      }
    }
  }

  const arraySum = (array) => {
    if (array.length === 1){
      return array[0];
    }
    let newArray = new Array(array[0].length).fill(0);
    for (let i = 0; i < array.length; i++){
      for (let j = 0; j < array[i].length; j++){
        newArray[j] += array[i][j];
      }
    }
    return(newArray);
  }

  if(view ==="form"){
    return (
      <Form handleSubmit={handleSubmit} />
    )
  }
  else {
    return(
      <div>
        <p>This is the scoreboard.</p>
        <table>
          <thead>
            <tr> 
              <th key="Suits">Suits</th>
            {gameData.players.map((player) => (
                <th key={player}>{player}</th>
            ))}
              <th key="r0w"></th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round, index) => (
              <RoundRow key={round.hands + round.suit + index} round={rounds[index]} currentRound={currentRound} index={index} roundBids={roundBids[index]} roundGets={roundGets[index]} 
              roundScores={roundScores[index]} bidsDone={bidsDone} handleBidsDone={handleBidsDone} handleGetsDone={handleGetsDone} handleBidsChange={handleBidsChange}
              handleGetsChange={handleGetsChange} errorMessage={errorMessage} cumulativeScores={cumulativeScores[index]} handleUndo={handleUndo}/>
            ))}

          </tbody>
        </table>
        {currentRound>=rounds.length?(
          <button onClick={() => submitGame()} >Submit Game!</button>
        ):(<></>)}
      </div>
    )
  }
}

export default Scoreboard