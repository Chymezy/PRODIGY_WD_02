import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaStop, FaUndo, FaClock, FaTimesCircle } from 'react-icons/fa';

interface TimerProps {
  onRemove: () => void;
  darkMode: boolean;
  label: string;
  onUpdateLabel: (newLabel: string) => void;
  onComplete: (label: string, duration: number) => void;
}

const Timer: React.FC<TimerProps> = ({ onRemove, darkMode, label, onUpdateLabel, onComplete }) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<string>('00:00:00');
  const [initialTime, setInitialTime] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onComplete(label, initialTime);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time, label, initialTime, onComplete]);

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!isRunning && time === 0) {
      const [hours, minutes, seconds] = inputTime.split(':').map(Number);
      const newTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
      setTime(newTime);
      setInitialTime(newTime);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setInputTime('00:00:00');
    setInitialTime(0);
  };

  const handleLabelClick = () => {
    const newLabel = prompt('Enter a new label for this timer:', label);
    if (newLabel) {
      onUpdateLabel(newLabel);
    }
  };

  const getProgressPercentage = () => {
    if (initialTime === 0) return 0;
    return ((initialTime - time) / initialTime) * 100;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full`}>
      <div className="relative">
        <button
          onClick={onRemove}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimesCircle />
        </button>
        <h2 
          className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 cursor-pointer hover:underline flex items-center"
          onClick={handleLabelClick}
        >
          <FaClock className="mr-2" /> {label}
        </h2>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center text-gray-800 dark:text-white font-mono">
        {formatTime(time)}
      </h1>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${getProgressPercentage()}%`}}></div>
      </div>
      <input
        type="text"
        value={inputTime}
        onChange={(e) => setInputTime(e.target.value)}
        className="w-full mb-4 p-2 text-center text-xl sm:text-2xl font-mono bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white"
        disabled={isRunning}
      />
      <div className="flex justify-center space-x-2 sm:space-x-4">
        <button
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-semibold transition-colors duration-300 ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={handleStartStop}
        >
          {isRunning ? <FaStop /> : <FaPlay />}
        </button>
        <button
          className="px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-colors duration-300"
          onClick={handleReset}
        >
          <FaUndo />
        </button>
      </div>
    </div>
  );
};

export default Timer;
