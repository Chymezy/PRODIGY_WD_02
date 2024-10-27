import React, { useState, useEffect, useRef } from 'react';

interface LapTime {
  id: number;
  time: string;
}

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps((prevLaps) => [
        ...prevLaps,
        { id: prevLaps.length + 1, time: formatTime(time) },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">{formatTime(time)}</h1>
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
            onClick={handleStartStop}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleLap}
            disabled={!isRunning}
          >
            Lap
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        {laps.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Lap Times</h2>
            <ul className="space-y-1">
              {laps.map((lap) => (
                <li key={lap.id} className="text-lg">
                  Lap {lap.id}: {lap.time}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
