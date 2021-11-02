import React, {useState} from 'react'

function Form({handleSubmit}){

  const [rounds, setRounds] = useState(2);
  const [upAndDown, setUpAndDown] = useState(false);
  const [bonusRound, setBonusRound] = useState(false);
  const [players, setPlayers] = useState(["Jack","Bradley"])

  const onSubmit = (event) => {
    event.preventDefault();
    let errors = formValidate();
    if (Object.keys(errors).length===0){
      handleSubmit({rounds: parseInt(rounds), upAndDown: upAndDown, bonusRound: bonusRound, players: players})
    }
    else {
      alert(Object.keys(errors).map((err, index) => (errors[err])));
    }
  }

  const formValidate = () => {
    let errors = {};
    if (!Number.isInteger(parseInt(rounds))){errors.rounds = "Rounds must be an Integer"};
    if (parseInt(rounds) < 2 ) {errors.rounds = "Rounds must be greater than 1"};
    if (parseInt(rounds)*players.length > 52 ) {errors.rounds = "Rounds multiplied by players must be less than 52 (the number of cards in the deck)"}
    if (typeof(upAndDown)!== 'boolean') {errors.upAndDown = "UpAndDown must be a boolean" }
    if (typeof(bonusRound)!== 'boolean') {errors.bonusRound = "UpAndDown must be a boolean" }
    players.forEach((player) => { if (!player){errors.players = "Player Name must not be empty"}});
    let noDups = new Set(players.map((player) => player.trim().toLowerCase()))
    if (noDups.size !== players.length) {errors.playerDuplicates= "No duplicate names"}
    if (players.length < 2) {errors.playerCount = "Must have at least two players"}
    return errors;
  }

  return(
    <div>
      <p>FORM</p>
      <form onSubmit={onSubmit} >
        <label>
          Number of Rounds
          <input type="number" value={rounds} onChange={(e) => {
            e.preventDefault();
            if (e.target.value > 1 && e.target.value*players.length <= 52 && !e.target.value.includes('.')){
              setRounds(e.target.value);
            }
          }} />
        </label>
        <label>
          Up and Down
          <input type="checkbox" checked={upAndDown} onChange={(e) => setUpAndDown(!upAndDown)} />
        </label>
        <label>
          Bonus Round
          <input type="checkbox" checked={bonusRound} onChange={(e) => setBonusRound(!bonusRound)} />
        </label>
        {players.map((player, i) => (
          <label key={i}>
            Player {i+1}
            <input type="text" value={players[i]} onChange={(e) => {
              e.preventDefault();
              if (!e.target.value.includes(" ")){
                let newArr = [...players]
                newArr[i] = e.target.value
                setPlayers(newArr)
              }
            }} />
          </label>
        ))}
        <button onClick={(e) => {
          e.preventDefault()
          let newArr = [...players]
          newArr.push("")
          setPlayers(newArr)
        }}>Add Player </button>
        <button onClick={(e) => {
          e.preventDefault()
          let newArr = [...players]
          newArr.pop()
          setPlayers(newArr)
        }}>Remove Player </button>
        <input type="submit" value="submit"/>
      </form>
      <div>
        {}
      </div>
    </div>
  )
}

export default Form