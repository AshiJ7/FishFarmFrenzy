import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      // Timer finished action
      setIsActive(false);
    }
    
    // Cleanup function to clear interval
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  return (
    <div>
      <h1>{seconds > 0 ? `${seconds}s` : 'Time\'s up!'}</h1>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => { setSeconds(60); setIsActive(false); }}>
        Reset
      </button>
    </div>
  );
};

export default Timer;
