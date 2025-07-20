import React, { useEffect, useState } from 'react';

function Header({ tasks = [] }) {
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

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <header className="flex flex-col gap-4 py-6 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📋</div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stay organized, stay productive
            </p>
          </div>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white dark:bg-gray-700 text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      
      {totalTasks > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>{completedTasks} of {totalTasks} completed</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {progressPercentage === 100 ? '🎉 All tasks completed!' : 
             progressPercentage >= 75 ? '🔥 Almost there!' :
             progressPercentage >= 50 ? '💪 Halfway there!' :
             progressPercentage >= 25 ? '🚀 Getting started!' : '📝 Let\'s begin!'}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
