import joe from "../images/joe.jfif";

function Homepage(props) {
  return (
    <div
      className="homepage grid justify-center justify-items-center gap-4 bg-gradient-to-t from-red-100"
      // style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-4xl font-bold text-stone-900">ET Bidding Game</h1>
      <img src={joe} alt="joe" className="w-40 h-83" />
      <h1 className="text-2xl font-bold text-stone-900">
        Merry Christmas Joe!
      </h1>
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
