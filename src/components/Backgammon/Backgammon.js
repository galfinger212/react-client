import "../Backgammon/Backgammon.css";
import { useEffect, useState, useRef } from "react";
import Piece from "../Piece/Piece";
import Timer from "../Timer/Timer";
import Triangle from '../Triangle/Triangle';

const Backgammon = ({ propsBoard, currentBoard, userPlayId, initSocket, EndGame }) => {
    const PF = process.env.PUBLIC_URL;
    const socket = useRef(initSocket);

    const [points, setPoints] = useState([]);
    const [arrivalPoints, setArrivalPoints] = useState(null);
    const [nextTurn, setNextTurn] = useState(null);
    const [winStatus, setWinStatus] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [dieOneValue, setDieOneValue] = useState(null);
    const [dieTwoValue, setDieTwoValue] = useState(null);
    const [dices, setDices] = useState([]);
    const [middleBar, setMiddleBar] = useState(null);
    const [p1IsNext, setP1IsNext] = useState(null);
    const [outSideBar, setOutSideBar] = useState(null);
    const [userPlay, setUserPlay] = useState(null);
    const [userAgainst, setUserAgainst] = useState(null);
    const [currentUserPlay, setCurrentUserPlay] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState(null);

    const roll = () => {
        async function promiseFunc() {
            return new Promise(res => {
                let cubes = document.getElementsByClassName("dice");
                for (let index = 0; index < cubes.length; index++) {
                    const cube = cubes[index];
                    cube.classList.add("shake");
                }
                setTimeout(() => {
                    for (let index = 0; index < cubes.length; index++) {
                        const cube = cubes[index];
                        cube.classList.remove("shake");
                    }
                }, 300);
                let dieOne = Math.floor(Math.random() * 6) + 1;
                let dieTwo = Math.floor(Math.random() * 6) + 1;
                setDieOneValue(dieOne);
                setDieTwoValue(dieTwo);
                if (dieOne === dieTwo) {//double
                    res([dieOne, dieOne, dieOne, dieOne])
                }
                else {
                    res([dieOne, dieTwo])
                }
            })
        }

        promiseFunc().then(dice => {
            setDices(dice);
            getPointsWithoutActions(points).then(pointsNoAction => {
                setRolling(!rolling)
                let allPoints = CalculateAllMoves(pointsNoAction, dice, p1IsNext, middleBar).points;
                //check if there are any optional ways to move on the board , if not he need to pass the turn 
                if (checkIfPlayerCanMove(allPoints) === false) {
                    PassTurnToOtherUser();
                    alert("You don't have any moves...")
                }
                setPoints(allPoints);
            })
        })

    }

    //get all the points without the actions
    async function getPointsWithoutActions() {
        return new Promise(res => {
            res(points.map((point) => {
                return { player: point.player, checkers: point.checkers };
            }))
        })
    }

    //register to all the socket events and init game
    useEffect(() => {
        setUserPlay(userPlayId);
        setPoints(propsBoard);
        setMiddleBar({ checkersP1: 0, checkersP2: 0 })
        setOutSideBar({ checkersP1: 0, checkersP2: 0 })
        socket.current.on("getCurrentPoints", (data) => {
            setArrivalPoints({
                sender: data.senderId,
                currentPoints: data.currentPoints,
                currentMiddleBar: data.currentMiddleBar,
                currentOutsideBar: data.currentOutsideBar,
                createdAt: Date.now(),
            });
        });
        socket.current.on("getNextTurn", (data) => {
            setNextTurn({
                sender: data.senderId,
                createdAt: Date.now(),
            });
        });
        socket.current.on("getWin", (data) => {
            setWinStatus({
                sender: data.senderId,
                createdAt: Date.now(),
            });
        });
        for (let index = 0; index < currentBoard.members.length; index++) {
            const userId = currentBoard.members[index];
            if (userPlayId !== userId) setUserAgainst(userId)
        }
        if (userPlayId === currentBoard.members[0]) {
            setCurrentUserPlay(userPlayId);
            setP1IsNext(true);//black player and start
        }
        else {
            setP1IsNext(false);//white player
        }
    }, []);

    //update the board after the other user send a event
    useEffect(() => {
        if (arrivalPoints !== null) {
            setPoints(arrivalPoints.currentPoints)//setBoard
            setMiddleBar(arrivalPoints.currentMiddleBar)//setMiddleBar
            setOutSideBar(arrivalPoints.currentOutsideBar);//setOutsideBar
        }
    }, [arrivalPoints]);

    //update the next turn after the other user send a event
    useEffect(() => {
        if (nextTurn !== null) {
            setCurrentUserPlay(userPlay);
            if (rolling === true) {
                setRolling(!rolling);
            }
        }
    }, [nextTurn]);

    //update the win status after the other user send a event
    useEffect(() => {
        if (winStatus !== null) {
            alert("Game over!!! \n You lose...");
            EndGame();//reset board - parent component - contactScreen
        }
    }, [winStatus]);

    //check if there ara any checkers that belong to the current player on the board, if not he win
    const CheckCheckersOnBoard = (points) => {
        let anyChecker = false;
        //get points with actions
        points.map((point) => {//Check homeBoard
            //Player 1 // black
            if (p1IsNext && point.player === "black"
            ) {
                anyChecker = true;
            }
            //Player 2 // white
            else if (!p1IsNext && point.player === "white"
            ) {
                anyChecker = true;
            }
            return null;
        });
        return anyChecker;//if true - there is a checkers in the board that belong to the current player, if false he win - 0 checkers on the board 
    }

    //get the current player
    const getPlayer = (p1IsNext) => p1IsNext ? "black" : "white";

    //send the other user that he lose the game...
    const sendWinToUser = () => {
        socket.current.emit("sendWin", {
            senderId: userPlay,
            receiverId: userAgainst,
        });
        alert("Game over!!! \n You win!!!");
        EndGame();//reset board - parent component - contactScreen
    }
    const TimeIsOver = () => {
        getPointsWithoutActions(points).then(pointsNoAction => {
            setSelectedPiece(null);
            setPoints(pointsNoAction);
            alert("Time is over!!!")
            PassTurnToOtherUser();
        })
    }
    //calculate the all optionals move of the game
    const CalculateAllMoves = (points, AllDices, p1IsNext, middleBar) => {
        let newPoints = [...points];
        if (!AllDices[0]) {
            // No dice to play
        }
        else {
            //check if there are a checkers that belong to the current player on the middleBar
            if ((p1IsNext && middleBar.checkersP1 > 0) || (!p1IsNext && middleBar.checkersP2 > 0)) {
                for (let die of AllDices) {
                    const destination = p1IsNext ? die - 1 : 24 - die;
                    if (points[destination].player === getPlayer(p1IsNext) || //point belongs to user
                        points[destination].checkers < 2) { //point is empty or belongs to other user but with only one checker
                        if (newPoints[destination].canReceive) {
                            newPoints[destination].canReceive.push(destination);
                        }
                        else {
                            newPoints[destination].canReceive = [destination];
                        }
                    }
                }
            }
            else {
                //Check if player has all the checkers in the home board
                const inHomeBoard = checkHomeBoard(points);
                for (let index = 0; index < points.length; index++) {
                    //Check if checker can move
                    if (points[index] && (points[index].player === getPlayer(p1IsNext))) {
                        for (let die of AllDices) {
                            const destination = p1IsNext ? index + die : index - die;
                            if (destination < 24 && destination >= 0) {
                                if (points[destination].player === getPlayer(p1IsNext) ||
                                    points[destination].checkers < 2) {
                                    if (newPoints[index].canMove) {
                                        newPoints[index].canMove.push(destination);
                                    }
                                    else {
                                        newPoints[index].canMove = [destination];
                                    }
                                }
                            }
                        }
                    }
                    //check if checker can bear off
                    if (inHomeBoard && ((p1IsNext && index >= 18) || (!p1IsNext && index <= 5))) {
                        let numDice = checkCanBearOff(points, index, AllDices);
                        if (numDice) {
                            newPoints[index].canBear = numDice;
                        }
                    }
                }
            }
        }
        return { points: newPoints };
    }

    const checkIfPlayerCanMove = (newPoints) => {
        let canMove = false;
        //get points with actions
        newPoints.map((point) => {//Check homeBoard
            //Player 1 // black
            if (point.canMove || point.canBear || point.canReceive) {
                canMove = true;
            }
            return null;
        });
        return canMove;
    }

    const checkCanBearOff = (points, checker, dice) => {
        let canBearOff = false;
        //Check if it is a player checker
        if (checker >= 0 && checker < 24 && points[checker].player === getPlayer(p1IsNext)) {
            for (let die of dice) {
                //check if the dice have the right number to bear off
                if ((p1IsNext && (checker + die) === 24) || (!p1IsNext && (checker - die) === -1)) {
                    canBearOff = die;
                }
            }
            if (!canBearOff) {
                const highDie = [...dice].sort().reverse()[0]; //Get the highest die
                let checkerBehind = false;//Check if there is checker behind the moving checker
                //die is more than necessary to bear off
                if ((p1IsNext && (checker + highDie) > 24) || (!p1IsNext && (checker - highDie) < -1)) {
                    if (p1IsNext) {
                        for (let i = 18; i < checker; i++) {
                            if (points[i].player && points[i].player === getPlayer(p1IsNext)) {
                                checkerBehind = true;
                            }
                        }
                    } else {
                        for (let i = 5; i > checker; i--) {
                            if (points[i].player && points[i].player === getPlayer(p1IsNext)) {
                                checkerBehind = true;
                            }
                        }
                    }
                    //If there is no checker behind, it can bear off
                    if (!checkerBehind) {
                        canBearOff = highDie;
                    }
                }
            }
        }
        return canBearOff;
    }

    const checkHomeBoard = (points) => {
        //Checkers in homeboard. If true it's good to go outside
        let homeBoard = true;
        //get points with actions
        points.map((point, index) => {
            //Check homeboard
            //Player 1 // black
            if (p1IsNext && index <= 17
                && point.player === "black"
            ) {
                homeBoard = false;
            }
            //Player 2 // white
            else if (!p1IsNext && index >= 6
                && point.player === "white"
            ) {
                homeBoard = false;
            }
            return null;
        });
        return homeBoard;
    }

    //set selected piece
    const handleClick = (piece) => {
        setSelectedPiece(piece)
    };

    //remove the enemy piece to the middle bar
    const removeEnemyToTheMiddleBar = (column) => {
        if (p1IsNext) {
            middleBar.checkersP2++
        } else {
            middleBar.checkersP1++
        }
        points[column].checkers = 0;
        points[column].player = getPlayer(p1IsNext);
    }

    //start when the player click the optional triangle
    const movePiece = (props) => {
        let column = props.column;
        //the current player have a checkers on middle bar
        if ((p1IsNext && middleBar.checkersP1 > 0) ||
            (!p1IsNext && middleBar.checkersP2 > 0)) {
            if (points[column].player !== false && points[column].player !== getPlayer(p1IsNext) &&
                points[column].checkers < 2) { //point is empty and belongs to other user but with only one checker
                removeEnemyToTheMiddleBar(column);
            }
            else //point belongs to user or empty
            {
                if (points[column].player === false) {//point empty 
                    points[column].player = getPlayer(p1IsNext); // update the player that own the column
                }
            }
            points[column].checkers += 1; // insert the new checker from middleBar
            if (p1IsNext) { // remove the previous checker from middleBar
                middleBar.checkersP1 -= 1;
            } else {
                middleBar.checkersP2 -= 1;
            }
            //find index of current dice in dices array and remove dice
            const indexDice = dices.indexOf(p1IsNext ? column + 1 : 24 - column);
            if (indexDice > -1) {
                dices.splice(indexDice, 1);
                setDices(dices)
            }
        }
        else {//there is no middleBar checkers
            //can bear the checker off the homeBoard
            if (points[selectedPiece.column].canBear && column === undefined) {
                points[selectedPiece.column].checkers -= 1;
                if (points[selectedPiece.column].checkers === 0) {
                    points[selectedPiece.column].player = false;
                }
                if (p1IsNext) outSideBar.checkersP1++
                else outSideBar.checkersP2++
                const indexDice = dices.indexOf(points[selectedPiece.column].canBear);
                if (indexDice > -1) {
                    dices.splice(indexDice, 1);
                    setDices(dices)
                }
            }
            else {//cant bear the checker off the homeBoard
                //empty column
                if (points[column].player === false) {
                    points[column].player = selectedPiece.color
                }
                //can eat the enemy
                if (points[column].checkers === 1 && points[column].player !== points[selectedPiece.column].player) {
                    removeEnemyToTheMiddleBar(column);
                }
                //checker leave alone from the column
                if (points[selectedPiece.column].checkers === 1) {
                    points[selectedPiece.column].player = false;
                }
                //insert the new checker to the new column
                points[column].checkers += 1;
                //find index of current Move in canMove array
                const index = points[selectedPiece.column].canMove.indexOf(column);
                if (index > -1) {
                    points[selectedPiece.column].canMove.splice(index, 1);
                }
                //find index of current dice in dices array and remove the dice
                let dice = Math.abs(selectedPiece.column - column);
                const indexDice = dices.indexOf(dice);
                if (indexDice > -1) {
                    dices.splice(indexDice, 1);
                    setDices(dices)
                }
                //remove the checker from the clicked checker column
                points[selectedPiece.column].checkers -= 1
            }
        }
        setPoints(points => [...points]);
        //finish turn
        if (dices.length === 0) {
            PassTurnToOtherUser();
        }
        //check player win!!!
        if (CheckCheckersOnBoard(points) === false && ((p1IsNext && middleBar.checkersP1 === 0) ||
            (!p1IsNext && middleBar.checkersP2 === 0))) {
            //current player win
            sendWinToUser();
        }
        else {//continue regular
            getPointsWithoutActions(points).then(pointsNoAction => {
                sendCurrentPointsToEnemy(pointsNoAction);
                let allPoints = CalculateAllMoves(pointsNoAction, dices, p1IsNext, middleBar).points;
                if (checkIfPlayerCanMove(allPoints) === false && dices.length !== 0) {
                    PassTurnToOtherUser();
                    alert("You don't have any moves...")
                }
                setPoints(allPoints);
                setPoints(allPoints);
            })
            setSelectedPiece(null);
        }
    };

    //pass the turn to the other user
    const PassTurnToOtherUser = () => {
        setDices([]);
        setCurrentUserPlay(userAgainst);
        socket.current.emit("sendNextTurn", {
            senderId: userPlay,
            receiverId: userAgainst,
        });
    }

    //update the enemy about the current board (after all move )
    const sendCurrentPointsToEnemy = (pointsNoAction) => {
        socket.current.emit("sendCurrentPoints", {
            senderId: userPlay,
            receiverId: userAgainst,
            currentPoints: pointsNoAction,
            currentMiddleBar: middleBar,
            currentOutsideBar: outSideBar
        });
    }

    //render the outSidebar (where the player put his checkers that finish the game)
    const renderOutSideBar = (player, numberOfCheckers) => {
        const items = [];
        if (numberOfCheckers > 0) {
            items.push(<Piece color={player} className={`outsideBar ` + player}></Piece>)
            if (numberOfCheckers > 1) {
                items.push(<div className={`${player === "black" ? "whiteTextOutBar" : "blackTextOutBar"}`}>{numberOfCheckers}</div>)
            }
        }
        return items;
    }

    //render the middle bar where the checkers that was eaten present
    const renderMiddleBar = (player, numberOfCheckers) => {
        const items = [];
        if (numberOfCheckers > 0) {
            items.push(<Piece color={player} className={`${player === "black" ? "middleBarBlack" : "middleBarWhite"} ` + player}></Piece>)
            if (numberOfCheckers > 1) {
                items.push(<div className={`${player === "black" ? "whiteText" : "blackText"}`}>{numberOfCheckers}</div>)
            }
        }
        return items;
    }

    //check if current triangle can receive a checker
    const checkCanReceive = (numColumn) => {
        if ((selectedPiece && points[selectedPiece?.column].canMove?.includes(numColumn)) || points[numColumn]?.canReceive) {
            return true;
        }
        return false;
    }

    //render all checkers on the board
    const renderCheckers = (column, numColumn) => {
        const items = [];
        for (let index = 0; index < column.checkers; index++) {
            let last = '';
            //last and can move or can bear
            if (((index >= 0 && index == column.checkers - 1) || index == 4) && (column.canMove || column.canBear)) {
                last = "Last";
            }
            //checkers at columns 1 - 5
            if (numColumn >= 0 && numColumn <= 5) {
                //last and greater than 5 checkers
                if (column.checkers > 5 && index == column.checkers - 1) {
                    items.push(<div className={`${column.player === "black" ? "whiteTextBottom" : "blackTextBottom"} rightText${numColumn} `}>{column.checkers}</div>)
                }
                else if (index < 5) {
                    items.push(<Piece pieceKey={`c${numColumn}i${index}`} color={column.player} column={numColumn} indexInColumn={index} onClick={last !== '' ? handleClick : ""} className={column.player + ` right${numColumn} ${last}` + ` bottom${index}`}></Piece>)
                }
            }
            //checkers at columns 6 - 11
            else if (numColumn >= 6 && numColumn <= 11) {
                //last and greater than 5 checkers
                if (column.checkers > 5 && index == column.checkers - 1) {
                    items.push(<div className={`${column.player === "black" ? "whiteTextBottom" : "blackTextBottom"} leftText${11 - numColumn} `}>{column.checkers}</div>)
                }
                else if (index < 5) {
                    items.push(<Piece pieceKey={`c${numColumn}i${index}`} color={column.player} column={numColumn} indexInColumn={index} onClick={last !== '' ? handleClick : ""} className={column.player + ` left${11 - numColumn} ${last}` + ` bottom${index}`}></Piece>)
                }
            }
            //checkers at columns 12 - 17
            else if (numColumn >= 12 && numColumn <= 17) {
                //last and greater than 5 checkers
                if (column.checkers > 5 && index == column.checkers - 1) {
                    items.push(<div className={`${column.player === "black" ? "whiteTextTop" : "blackTextTop"} leftText${numColumn - 12}`}>{column.checkers}</div>)
                }
                else if (index < 5) {
                    items.push(<Piece pieceKey={`c${numColumn}i${index}`} color={column.player} column={numColumn} indexInColumn={index} onClick={last !== '' ? handleClick : ""} className={column.player + ` left${numColumn - 12} ${last}` + ` top${index}`}></Piece>)
                }
            }
            //checkers at columns 18 - 23
            else if (numColumn >= 18 && numColumn <= 23) {
                //last and greater than 5 checkers
                if (column.checkers > 5 && index == column.checkers - 1) {
                    items.push(<div className={`${column.player === "black" ? "whiteTextTop" : "blackTextTop"} rightText${23 - numColumn} `}>{column.checkers}</div>)
                }
                else if (index < 5) {
                    items.push(<Piece pieceKey={`c${numColumn}i${index}`} color={column.player} column={numColumn} indexInColumn={index} onClick={last !== '' ? handleClick : ""} className={column.player + ` right${23 - numColumn} ${last}` + ` top${index}`}></Piece>)
                }
            }
        }
        return items;
    }

    return (
        <>
            <div className="topPage">
                {currentUserPlay === userPlay ? <Timer timeLimit={60} reachLimit={TimeIsOver}></Timer> : ""}
                <div className="outSideBar">
                    <h1 className="currentTurn">
                        {`${currentUserPlay === userPlay ? "Its your" : "Wait for your"} turn!`}
                    </h1>
                    <img src={PF + `/Images/homeBoard.png`} />
                    {outSideBar ? renderOutSideBar("white", outSideBar.checkersP2) : ""}
                    {outSideBar ? renderOutSideBar("black", outSideBar.checkersP1) : ""}
                    {selectedPiece && points[selectedPiece.column].canBear ?
                        <button className="bearoffBtn" onClick={movePiece} >
                            Bear Off
                        </button> : ""}
                </div>
            </div>
            <div className="board">
                {userPlay === currentUserPlay ? <div id="wrapper">
                    <img className="dice" src={dices.length ? PF + `/Images/${dieOneValue}.png` : ""} />
                    <img className="dice" src={dices.length ? PF + `/Images/${dieTwoValue}.png` : ""} />
                    {rolling === false ? <button className="btnRoll" onClick={roll}>ROLL</button> : ""}
                </div> : ""}
                <div className="left-bin">
                    <div className="top-row">
                        <Triangle column={12} onClick={checkCanReceive(12) ? movePiece : () => ""}
                            className={`arrow-down odd ${checkCanReceive(12) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={13} onClick={checkCanReceive(13) ? movePiece : () => ""}
                            className={`arrow-down even ${checkCanReceive(13) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={14} onClick={checkCanReceive(14) ? movePiece : () => ""}
                            className={`arrow-down odd ${checkCanReceive(14) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={15} onClick={checkCanReceive(15) ? movePiece : () => ""}
                            className={`arrow-down even ${checkCanReceive(15) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={16} onClick={checkCanReceive(16) ? movePiece : () => ""}
                            className={`arrow-down odd ${checkCanReceive(16) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={17} onClick={checkCanReceive(17) ? movePiece : () => ""}
                            className={`arrow-down even ${checkCanReceive(17) ? "triangle" : ""}`}>
                        </Triangle>
                    </div>
                    <div className="bottom-row">
                        <Triangle column={11} onClick={checkCanReceive(11) ? movePiece : () => ""}
                            className={`arrow-up odd ${checkCanReceive(11) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={10} onClick={checkCanReceive(10) ? movePiece : () => ""}
                            className={`arrow-up even ${checkCanReceive(10) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={9} onClick={checkCanReceive(9) ? movePiece : () => ""}
                            className={`arrow-up odd ${checkCanReceive(9) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={8} onClick={checkCanReceive(8) ? movePiece : () => ""}
                            className={`arrow-up even ${checkCanReceive(8) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={7} onClick={checkCanReceive(7) ? movePiece : () => ""}
                            className={`arrow-up odd ${checkCanReceive(7) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={6} onClick={checkCanReceive(6) ? movePiece : () => ""}
                            className={`arrow-up even ${checkCanReceive(6) ? "triangle" : ""}`}>
                        </Triangle>
                    </div>
                </div>
                <div className="middle-bar">
                </div>
                <div className="right-bin">
                    <div className="top-row">
                        <Triangle column={18} onClick={checkCanReceive(18) ? movePiece : () => ""}
                            className={`arrow-down odd ${checkCanReceive(18) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={19} onClick={checkCanReceive(19) ? movePiece : () => ""}
                            className={`arrow-down even ${checkCanReceive(19) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={20} onClick={checkCanReceive(20) ? movePiece : () => ""}
                            className={`arrow-down odd ${checkCanReceive(20) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={21} onClick={checkCanReceive(21) ? movePiece : () => ""}
                            className={`arrow-down even ${checkCanReceive(21) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={22} onClick={checkCanReceive(22) ? movePiece : () => ""}
                            className={`arrow-down odd ${checkCanReceive(22) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={23} onClick={checkCanReceive(23) ? movePiece : () => ""}
                            className={`arrow-down even ${checkCanReceive(23) ? "triangle" : ""}`}>
                        </Triangle>
                    </div>
                    <div className="bottom-row">
                        <Triangle column={5} onClick={checkCanReceive(5) ? movePiece : () => ""}
                            className={`arrow-up odd ${checkCanReceive(5) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={4} onClick={checkCanReceive(4) ? movePiece : () => ""}
                            className={`arrow-up even ${checkCanReceive(4) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={3} onClick={checkCanReceive(3) ? movePiece : () => ""}
                            className={`arrow-up odd ${checkCanReceive(3) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={2} onClick={checkCanReceive(2) ? movePiece : () => ""}
                            className={`arrow-up even ${checkCanReceive(2) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={1} onClick={checkCanReceive(1) ? movePiece : () => ""}
                            className={`arrow-up odd ${checkCanReceive(1) ? "triangle" : ""}`}>
                        </Triangle>
                        <Triangle column={0} onClick={checkCanReceive(0) ? movePiece : () => ""}
                            className={`arrow-up even ${checkCanReceive(0) ? "triangle" : ""}`}>
                        </Triangle>
                    </div>
                </div>
                {points.map((column, numColumn) => (
                    <>
                        {renderCheckers(column, numColumn)}
                    </>
                ))
                }
                <>
                    {middleBar ? renderMiddleBar("white", middleBar.checkersP2) : ""}
                    {middleBar ? renderMiddleBar("black", middleBar.checkersP1) : ""}
                </>
            </div>
        </>
    );
}
export default Backgammon