import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./CircularTimer.scss";

const CircularTimer = ({ duration, timer }) => {
  const [progress, setProgress] = useState(100);

  // Update progress whenever the timer updates
  useEffect(() => {
    const newProgress = (timer / duration) * 100;
    setProgress(newProgress);
  }, [timer, duration]);

  const circleRadius = 20;
  const circleCircumference = 2 * Math.PI * circleRadius;

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="refresh-tooltip">Refresh in {timer} seconds</Tooltip>
      }
    >
      <div className="circular-timer">
        <svg className="progress-ring" width="50" height="50">
          <circle
            className="progress-ring__circle__background"
            stroke="#e0e0e0"
            strokeWidth="4"
            fill="transparent"
            r={circleRadius}
            cx="25"
            cy="25"
          />
          <circle
            className="progress-ring__circle"
            stroke="#00bcd4"
            strokeWidth="4"
            fill="transparent"
            r={circleRadius}
            cx="25"
            cy="25"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference - (progress / 100) * circleCircumference}
          />
        </svg>
        <div className="timer-text">{timer}s</div>
      </div>
    </OverlayTrigger>
  );
};

export default CircularTimer;
