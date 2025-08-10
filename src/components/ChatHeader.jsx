import React from 'react';
import { FiSun, FiMoon, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import PersonaSelector from './PersonaSelector';

const ChatHeader = () => {
  const { theme, toggleTheme, clearChat } = useChat();

  return (
    <header className="border-b border-indigo-200/70 dark:border-gray-700/80 shadow-sm transition-colors duration-300 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg border border-indigo-200/50 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20">
              <FiMessageSquare className="text-xl text-indigo-600 dark:text-purple-400" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              AI Chat Assistant
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <PersonaSelector />
            
            <button
              onClick={clearChat}
              className="p-2 rounded-lg border border-indigo-100 dark:border-gray-700/70 hover:border-indigo-200 dark:hover:border-gray-600 transition-colors duration-200 group"
              title="Clear chat"
            >
              <FiTrash2 className="text-gray-600/90 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-purple-400 transition-colors" />
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-indigo-100 dark:border-gray-700/70 hover:border-indigo-200 dark:hover:border-gray-600 transition-colors duration-200"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <FiMoon className="text-gray-600/90 dark:text-gray-400" />
              ) : (
                <FiSun className="text-amber-500/90" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;