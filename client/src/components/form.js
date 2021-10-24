import React, {useState} from 'react'

function Form({handleSubmit}){

  const [rounds, setRounds] = useState(10);
  const [upAndDown, setUpAndDown] = useState(true);
  const [bonusRound, setBonusRound] = useState(true);
  const [players, setPlayers] = useState(["Jack","Bradley"])

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit({rounds: rounds, upAndDown: upAndDown, bonusRound: bonusRound, players: players})
  }

  return(
    <div>
      <p>FORM</p>
      <form onSubmit={onSubmit} >
        <label>
          Number of Rounds
          <input type="number" value={rounds} onChange={(e) => setRounds(e.target.value) } />
        </label>
        <label>
          Up and Down
          <input type="checkbox" checked={upAndDown} onChange={(e) => setUpAndDown(e.target.value)} />
        </label>
        <label>
          Bonus Round
          <input type="checkbox" checked={bonusRound} onChange={(e) => setBonusRound(e.target.value)} />
        </label>
        {players.map((player, i) => (
          <label key={i}>
            Player {i+1}
            <input type="text" value={players[i]} onChange={(e) => {
              let newArr = [...players]
              newArr[i] = e.target.value
              setPlayers(newArr)
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
    </div>
  )
}

export default Form