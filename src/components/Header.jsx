import React, { useEffect, useState } from 'react';

function Header() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md">
      <h1 className="text-2xl font-bold">🗂️ Task Manager</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded"
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </header>
  );
}

export default Header;
