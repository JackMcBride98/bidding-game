function RoundRow({round, currentRound, index, roundBids, roundGets, roundScores, bidsDone, handleBidsDone, handleGetsDone, handleBidsChange, handleGetsChange, errorMessage, cumulativeScores, handleUndo}){


  if(index < currentRound){
    return(
      <tr>
        <td>{round.hands} {round.suit}</td>
        {roundBids.map((r, j) => (
          <td key={j}>{cumulativeScores[j]} {roundGets[j]}/{roundBids[j]}</td>
        ))}
        <td></td>
      </tr>
    )
  }
  else if (index === currentRound){
    return(
      <tr>
        <td>{round.hands} {round.suit}</td>
        {roundBids.map((bid, index) => (
          bidsDone?(
            <td key={index}>
            <button onClick={() => handleGetsChange('+', index)}>↑</button>
            <button onClick={() => handleGetsChange('-', index)}>↓</button>
            {roundGets[index]}/{bid}
            </td>
          ):(
          <td key={index}>
            {bid}
            <button onClick={() => handleBidsChange('+', index)}>↑</button>
            <button onClick={() => handleBidsChange('-', index)}>↓</button>
          </td>
          )
        ))}
        <td>
        {bidsDone?(
          <button onClick={() => handleGetsDone()}>Gets Done</button>
        ):(
          <button onClick={() => handleBidsDone()}>Bids Done</button>
        )}
        <button onClick={() => handleUndo()}> Undo </button>
        <p>{errorMessage}</p>
        </td>
      </tr>
    )
  }
  else {
    return(
      <tr>
        <td>{round.hands} {round.suit}</td>
        {roundBids.map((bid, index) => (
          <td key={index}></td>
        ))}
        <td>0</td>
      </tr>
    )
  }
}

export default RoundRow