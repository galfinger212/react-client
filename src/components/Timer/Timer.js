import React, { useState, useEffect } from 'react';
import "../Timer/Timer.css";

const Timer = ({ reachLimit, timeLimit }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            if (seconds > timeLimit - 1) {
                reachLimit();
            }
            setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <div data-testid="TimerDiv" className="app">
            <div data-testid="TimerTimeDiv" className="timerTime">
                {seconds}s / {timeLimit}s
            </div>
        </div>
    );
};

export default Timer;