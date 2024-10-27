import React, { useState, useEffect } from 'react';
import Stopwatch from './Stopwatch';
import Timer from './Timer';

interface TimerContainerProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

interface CompletedTask {
  label: string;
  duration: number;
  type: 'stopwatch' | 'timer';
  laps?: { id: number; time: string }[];
}

const TimerContainer: React.FC<TimerContainerProps> = ({ darkMode, setDarkMode }) => {
  const [timers, setTimers] = useState<Array<{ id: number; type: 'stopwatch' | 'timer'; label: string }>>(() => {
    const savedTimers = localStorage.getItem('timers');
    return savedTimers ? JSON.parse(savedTimers) : [{ id: 1, type: 'stopwatch', label: 'Task 1' }];
  });
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        addStopwatch();
      } else if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        addTimer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const addStopwatch = () => {
    const label = prompt('Enter a label for this task:') || `Task ${timers.length + 1}`;
    setTimers([...timers, { id: Date.now(), type: 'stopwatch', label }]);
  };

  const addTimer = () => {
    const label = prompt('Enter a label for this timer:') || `Timer ${timers.length + 1}`;
    setTimers([...timers, { id: Date.now(), type: 'timer', label }]);
  };

  const removeTimer = (id: number) => {
    setTimers(timers.filter(timer => timer.id !== id));
  };

  const updateLabel = (id: number, newLabel: string) => {
    setTimers(timers.map(timer => timer.id === id ? { ...timer, label: newLabel } : timer));
  };

  const handleComplete = (label: string, duration: number, type: 'stopwatch' | 'timer', laps?: { id: number; time: string }[]) => {
    setCompletedTasks([...completedTasks, { label, duration, type, laps }]);
  };

  const getTotalProductiveTime = () => {
    return completedTasks.reduce((total, task) => total + task.duration, 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900">
      <div className="flex justify-between items-center w-full p-4">
        <h1 className="text-2xl font-bold text-white">Productivity Timer</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          {timers.map((timer) => (
            <div key={timer.id} className="w-full">
              {timer.type === 'stopwatch' ? (
                <Stopwatch 
                  onRemove={() => removeTimer(timer.id)} 
                  darkMode={darkMode} 
                  label={timer.label} 
                  onUpdateLabel={(newLabel) => updateLabel(timer.id, newLabel)}
                  onComplete={(label, duration, laps) => handleComplete(label, duration, 'stopwatch', laps)}
                />
              ) : (
                <Timer 
                  onRemove={() => removeTimer(timer.id)} 
                  darkMode={darkMode} 
                  label={timer.label} 
                  onUpdateLabel={(newLabel) => updateLabel(timer.id, newLabel)}
                  onComplete={(label, duration) => handleComplete(label, duration, 'timer')}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 space-x-4">
          <button
            onClick={addStopwatch}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
          >
            Track New Task
          </button>
          <button
            onClick={addTimer}
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300"
          >
            Set New Timer
          </button>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Productivity Summary</h2>
          <p className="text-gray-600 dark:text-gray-300">Total Productive Time: {formatTime(getTotalProductiveTime())}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-white">Completed Tasks:</h3>
          <ul className="space-y-2">
            {completedTasks.map((task, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">
                {task.label} - {formatTime(task.duration)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const formatTime = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
};

export default TimerContainer;
