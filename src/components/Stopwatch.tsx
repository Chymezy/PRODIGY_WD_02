import React, { useState, useEffect, useRef } from 'react';
import GuideModal from './GuideModal';
import useSound from '../hooks/useSound';

interface LapTime {
  id: number;
  time: string;
}

interface StopwatchProps {
  onRemove: () => void;
  darkMode: boolean;
  label: string;
  onUpdateLabel: (newLabel: string) => void;
  onComplete: (label: string, duration: number, laps: LapTime[]) => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({ onRemove, darkMode, label, onUpdateLabel, onComplete }) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
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

  const playStart = useSound('/sounds/start.mp3');
  const playStop = useSound('/sounds/stop.mp3');
  const playLap = useSound('/sounds/lap.mp3');

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      playStart();
    } else {
      playStop();
      onComplete(label, time, laps);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps((prevLaps) => [
        { id: prevLaps.length + 1, time: formatTime(time) },
        ...prevLaps,
      ]);
      playLap();
    }
  };

  const handleLabelClick = () => {
    const newLabel = prompt('Enter a new label for this task:', label);
    if (newLabel) {
      onUpdateLabel(newLabel);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full`}>
      <div className="relative">
        <button
          onClick={onRemove}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✖️
        </button>
        <h2 
          className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 cursor-pointer hover:underline"
          onClick={handleLabelClick}
        >
          {label}
        </h2>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center text-gray-800 dark:text-white font-mono">{formatTime(time)}</h1>
      <div className="flex justify-center space-x-2 sm:space-x-4 mb-6">
        <button
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-semibold transition-colors duration-300 ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={handleStartStop}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          className="px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors duration-300"
          onClick={handleLap}
          disabled={!isRunning}
        >
          Lap
        </button>
        <button
          className="px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-colors duration-300"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      {laps.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Lap Times</h2>
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {laps.map((lap) => (
              <li key={lap.id} className="text-sm sm:text-base bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-gray-600 dark:text-gray-300">Lap {lap.id}</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">{lap.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default Stopwatch;
