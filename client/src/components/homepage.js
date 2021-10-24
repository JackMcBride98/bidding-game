function Homepage({createNewGame}) {
  return (
    <div className="homepage">
      <h1>The Bidding Game</h1>
      <button onClick={() => createNewGame()}>Create new game</button>
    </div>
  )
}

export default Homepage
