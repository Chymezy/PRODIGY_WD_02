import React, { useState, useEffect } from 'react';
import Stopwatch from './Stopwatch';
import Timer from './Timer';
import { FaSun, FaMoon, FaPlus } from 'react-icons/fa';

interface TimerContainerProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

interface CompletedTaskReport {
  label: string;
  duration: number;
  targetDuration: number | null;
  laps: { id: number; time: string; duration: number }[];
  completed: boolean;
  activityType: string;
}

const TimerContainer: React.FC<TimerContainerProps> = ({ darkMode, setDarkMode }) => {
  const [timers, setTimers] = useState<Array<{ id: number; type: 'stopwatch' | 'timer'; label: string }>>(() => {
    const savedTimers = localStorage.getItem('timers');
    return savedTimers ? JSON.parse(savedTimers) : [{ id: 1, type: 'stopwatch', label: 'Task 1' }];
  });
  const [completedTasks, setCompletedTasks] = useState<CompletedTaskReport[]>([]);

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

  const handleComplete = (report: CompletedTaskReport) => {
    setCompletedTasks([...completedTasks, report]);
  };

  const getTotalProductiveTime = () => {
    return completedTasks.reduce((total, task) => total + task.duration, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-opacity-90 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Productivity Timer</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={addStopwatch}
              className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors duration-300 shadow-lg"
            >
              <FaPlus className="mr-2" /> Track New Task
            </button>
            <button
              onClick={addTimer}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-300 shadow-lg"
            >
              <FaPlus className="mr-2" /> Set New Timer
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto">
          {/* Timers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {timers.map((timer) => (
              <div key={timer.id} className="flex">
                {timer.type === 'stopwatch' ? (
                  <Stopwatch 
                    onRemove={() => removeTimer(timer.id)} 
                    darkMode={darkMode} 
                    label={timer.label} 
                    onUpdateLabel={(newLabel) => updateLabel(timer.id, newLabel)}
                    onComplete={handleComplete}
                  />
                ) : (
                  <Timer 
                    onRemove={() => removeTimer(timer.id)} 
                    darkMode={darkMode} 
                    label={timer.label} 
                    onUpdateLabel={(newLabel) => updateLabel(timer.id, newLabel)}
                    onComplete={(label, duration) => handleComplete({
                      label,
                      duration,
                      targetDuration: null,
                      laps: [],
                      completed: true,
                      activityType: 'Timer'
                    })}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Summary Section */}
          {completedTasks.length > 0 && (
            <section className="bg-gray-50/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Productivity Summary
                  </h2>
                  <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Total Productive Time: 
                    <span className="ml-2 font-mono font-bold text-gray-800 dark:text-gray-200">
                      {formatTime(getTotalProductiveTime())}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Completed Tasks
                  </h3>
                  <div className="grid gap-4">
                    {completedTasks.map((task, index) => (
                      <div 
                        key={index} 
                        className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {task.label}
                            </span>
                          </div>
                          <span className="font-mono text-gray-700 dark:text-gray-300">
                            {formatTime(task.duration)}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="inline-flex items-center bg-gray-100 dark:bg-slate-600 px-2 py-1 rounded-full">
                            {task.activityType}
                          </span>
                          {task.targetDuration && (
                            <span className="inline-flex items-center">
                              Target: {formatTime(task.targetDuration)}
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                task.completed 
                                  ? 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-100' 
                                  : 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-100'
                              }`}>
                                {task.completed ? 'Completed' : 'Not Completed'}
                              </span>
                            </span>
                          )}
                          {task.laps.length > 0 && (
                            <span className="inline-flex items-center bg-gray-100 dark:bg-slate-600 px-2 py-1 rounded-full">
                              {task.laps.length} Laps
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
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
