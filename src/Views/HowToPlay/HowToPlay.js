import "./HowToPlay.css";
const HowToPlay = () => {

    return (
        <div className="about-section paddingTB60 gray-bg">
            <div className="container">
                <div className="row">
                    <div className="col-md-7 col-sm-6">
                        <div className="about-title clearfix">
                            <h1>How to play <span>Backgammon</span></h1>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/Eaa7KrIc4ys" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            <h4>Needed</h4>
                            <div>Two players, backgammon board, 15 checkers per player, two dice per player</div>
                            <h4>Terminology</h4>
                            <ul>
                                <li>Checker - game pieces that are moved around the board.</li>
                                <li>Point - a space on the board. The board is made up of 24 points.</li>
                                <li>Middle Bar - the bar in the middle of the game board.</li>
                                <li>Home Board - The six points on the bottom right of the playing board for each player.</li>
                            </ul>
                            <h4>Setup</h4>
                            <p>Players will sit across from each other. One player will move his/her checkers clockwise, and the other player will move his/her checkers counterclockwise.

                                Put five checkers on the 6-point, three checkers on the 8-point, five checkers on the 13-point, and two checkers on the 24-point. Your opponent will set up his/her checkers to mirror your checkers.</p>
                            <h4>Objective</h4>
                            <p>The object of Backgammon is to move your checkers around the board by rolling dice. The number rolled equals the number of points a checker can move. First, move all your checkers to your home board. Second, move all your checkers off the board.</p>
                            <h4>Game Play</h4>
                            <p>The game begins with each player rolling one die. The player with the higher number rolled gets to use both dice for the first move. Each dice is moved separately and can be moved forward to any point that is not blocked. When your opponent has two or more checkers on a point, that point is blocked. If the point has your own checkers, no checkers, or only one opponent checker, the point is open.
                                When both dice are rolled with the same number, the player will move double. For example, if double threes are rolled, the player will move three points four times.
                                When a player moves a checker onto a point that only has one opponent checker, the opponent’s checker is placed on the middle bar. Any checker on the middle bar has to be returned into play before making any other moves. A checker returns to the board on your farthest point. (i.e., the 24th point).</p>
                            <h4>Win</h4>
                            <p>Once a player’s checkers are all within his/her home board, he/she can begin removing checkers off the board. The first player to remove all of his/her checkers from the board wins the game.</p>
                            <h4>Rules</h4>
                            <ul>
                                <li>If a higher number is rolled than you have while removing checkers from the board, the farthest checker is to be removed.</li>
                                <li>If a player is unable to make a legal move with one or both dice, the roll is forfeited.</li>
                                <li>If a player has no checkers off the board when his opponent has removed all of his checkers, it is known as a Gammon and is worth a double game.</li>
                                <li>If a player still has a checker in his opponent’s home board or on the bar and his opponent has removed all of his checkers, it is known as a backgammon and is worth a triple game.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowToPlay;