import React from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">How to Use the Stopwatch</h2>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">▶️</span>
            <span>Click <strong>Start</strong> to begin the stopwatch</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">⏹️</span>
            <span>Click <strong>Stop</strong> to pause the stopwatch</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">🏁</span>
            <span>Click <strong>Lap</strong> to record a lap time</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-500 mr-2">🔄</span>
            <span>Click <strong>Reset</strong> to clear all times</span>
          </li>
        </ul>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default GuideModal;
