import aces from "../images/aces.jpg";

function Homepage(props) {
  return (
    <div
      className="homepage grid justify-center justify-items-center gap-4 bg-gradient-to-t from-red-100"
      // style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-4xl font-bold text-stone-900">ET Bidding Game</h1>
      <img src={aces} alt="aces" className="w-72 bg-transparent" />
      <button
        onClick={() => props.createNewGame()}
        className="border border-black rounded-lg p-2 bg-white"
      >
        Create new game
      </button>

      {props.children}
    </div>
  );
}

export default Homepage;
