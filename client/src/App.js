import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Homepage from './components/homepage';
import Scoreboard from './components/scoreboard';

function App() {

  // const [data, setData] = useState([]);
  // const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("home");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const result = await axios(
  //       'http://localhost:5000/count'
  //     );
  //     setCount(result.data.count)
  //     setIsLoading(false);
  //   }
  //   fetchData();
  // }, []) 

  // const postCount = async () => {
  //     const result = await axios.post('http://localhost:5000/count')
  //     setCount(result.data.count);
  // }

  const createNewGame = () => {
    setView("scoreboard");
  }

  const submitGame = () => {
    console.log("sumbit game")
    setView("home")
  }

  switch(view){
    case "scoreboard":
      return(
        <Scoreboard submitGame={submitGame}/>
      );
    default:
      return (
        <div className="App">
          <Homepage createNewGame={createNewGame} />
        </div>
      );
  }
}

export default App;
