import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Homepage from './components/homepage';
import Scoreboard from './components/scoreboard';
import Leaderboard from './components/leaderboard';
import GameHistory from './components/gamehistory';
import GamePage from './components/gamepage';
import ReactGA from 'react-ga';
ReactGA.initialize('G-VME9Y86TS0');
ReactGA.pageview(window.location.pathname + window.location.search);
// const serverurl =  "http://localhost:5000";
const serverurl = '';

function App() {
  // const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('recentGames');
  const [players, setPlayers] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [viewGame, setViewGame] = useState([]);
  const [isLoadingMoreGames, setIsLoadingMoreGames] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios(serverurl + '/count');
      const playersResult = await axios(serverurl + '/players');
      const gamesResult = await axios(serverurl + '/recentGames');
      setCount(result.data.count);
      let newGames = gamesResult.data;
      newGames.forEach(function (game) {
        game.unsortedPlayers = [];
        game.players.forEach(function (player, index) {
          player.score = game.totalScores[index];
          game.unsortedPlayers.push(player.name);
        });
        game.players.sort((a, b) =>
          a.score < b.score ? 1 : b.score < a.score ? -1 : 0
        );
      });
      setRecentGames(newGames);
      let newPlayers = playersResult.data;
      newPlayers.sort((a, b) =>
        a.totalScore < b.totalScore ? 1 : b.totalScore < a.totalScore ? -1 : 0
      );
      newPlayers = newPlayers.filter((player) => player.gameCount !== 0);
      setPlayers(newPlayers);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const postCount = async () => {
    const result = await axios.post(serverurl + '/count');
    setCount(result.data.count);
  };

  const createNewGame = () => {
    setView('scoreboard');
  };

  const submitGame = async (
    gameData,
    rounds,
    roundBids,
    roundGets,
    roundScores,
    totalScores,
    addToLeaderboard
  ) => {
    axios
      .post(serverurl + '/game', {
        location: gameData.location,
        date: new Date(),
        players: gameData.players,
        rounds: rounds,
        upAndDown: gameData.upAndDown,
        bonusRound: gameData.bonusRound,
        bids: roundBids,
        gets: roundGets,
        scores: roundScores,
        totalScores: totalScores,
        addToLeaderboard: addToLeaderboard,
      })
      .then(async function (response) {
        setIsLoading(true);
        const result = await axios(serverurl + '/count');
        const playersResult = await axios(serverurl + '/players');
        const gamesResult = await axios(serverurl + '/recentGames');
        setCount(result.data.count);
        let newGames = gamesResult.data;
        newGames.forEach(function (game) {
          game.unsortedPlayers = [];
          game.players.forEach(function (player, index) {
            player.score = game.totalScores[index];
            game.unsortedPlayers.push(player.name);
          });
          game.players.sort((a, b) =>
            a.score < b.score ? 1 : b.score < a.score ? -1 : 0
          );
        });
        setRecentGames(newGames);
        let newPlayers = playersResult.data;
        newPlayers.sort((a, b) =>
          a.totalScore < b.totalScore ? 1 : b.totalScore < a.totalScore ? -1 : 0
        );
        newPlayers = newPlayers.filter((player) => player.gameCount !== 0);
        setPlayers(newPlayers);
        setIsLoading(false);
        setView('recentGames');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const manageGames = async () => {
    if (view === 'recentGames') {
      setIsLoadingMoreGames(true);
      const allGamesResult = await axios(serverurl + '/allGames');
      let newGames = allGamesResult.data;
      newGames.forEach(function (game) {
        game.unsortedPlayers = [];
        game.players.forEach(function (player, index) {
          player.score = game.totalScores[index];
          game.unsortedPlayers.push(player.name);
        });
        game.players.sort((a, b) =>
          a.score < b.score ? 1 : b.score < a.score ? -1 : 0
        );
      });
      setRecentGames(newGames);
      setIsLoadingMoreGames(false);
      setView('allGames');
    } else {
      setRecentGames(recentGames.slice(0, 5));
      setView('recentGames');
    }
  };

  const handleMoreInfo = (game) => {
    // generate cumulative scores
    let holder = [];
    for (var i = 0; i < game.scores.length; i++) {
      holder[i] = game.scores[i].slice(0);
    }
    for (let i = 1; i < holder.length; i++) {
      for (let j = 0; j < holder[i].length; j++) {
        holder[i][j] += holder[i - 1][j];
      }
    }
    game.cumulativeScores = holder;
    setViewGame(game);
    setView('gamepage');
  };

  const handleSort = (column) => {
    if (column === 'pph') {
      setPlayers(
        players.forEach(
          (player) => (player.pph = player.totalScore / player.totalHands)
        )
      );
    }
    setPlayers([
      ...players.sort((a, b) =>
        a[column] < b[column] ? 1 : a[column] > b[column] ? -1 : 0
      ),
    ]);
  };

  if (view === 'scoreboard') {
    return <Scoreboard submitGame={submitGame} setAppView={setView} />;
  } else if (view === 'gamepage') {
    return (
      <GamePage game={viewGame} setAppView={setView}>
        <button
          onClick={() => setView('home')}
          className="border border-black rounded-lg p-2 bg-white mb-6 text-stone-900 text-lg"
        >
          Back to Home
        </button>
      </GamePage>
    );
  } else {
    return (
      <div className="App font-sans">
        <Homepage createNewGame={createNewGame}>
          <button
            onClick={() => postCount()}
            className="hover:text-lg text-red-500"
          >
            ❤️ <span className="font-bold">{count}</span>
          </button>
          <h1 className="text-2xl font-semibold text-stone-900">Leaderboard</h1>
          <Leaderboard
            players={players}
            isLoading={isLoading}
            handleSort={handleSort}
          />
          <h1 className="text-2xl font-semibold text-stone-900">
            Game History{' '}
          </h1>
          <GameHistory
            games={recentGames}
            isLoading={isLoading}
            handleMoreInfo={handleMoreInfo}
          />
          {isLoadingMoreGames ? (
            <p>Loading more games...</p>
          ) : (
            <button
              onClick={() => manageGames()}
              className="border border-black rounded-lg p-2 bg-white mb-6"
            >
              {view === 'allGames'
                ? 'Show only recent games'
                : 'See more games'}
            </button>
          )}
        </Homepage>
      </div>
    );
  }
}

export default App;
