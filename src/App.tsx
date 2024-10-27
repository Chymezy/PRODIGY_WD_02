import React, { useState, useEffect } from 'react'
import TimerContainer from './components/TimerContainer'

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <TimerContainer darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  )
}

export default App
