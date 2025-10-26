import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiTrash2, FiMessageSquare, FiMenu, FiX } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import PersonaSelector from './PersonaSelector';

const ChatHeader = () => {
  const { theme, toggleTheme, clearChat } = useChat();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="border-b border-indigo-200/70 dark:border-gray-700/80 shadow-sm transition-colors duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 rounded-lg border border-indigo-200/50 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20">
              <FiMessageSquare className="text-lg sm:text-xl text-indigo-600 dark:text-purple-400" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 truncate">
              AI Chat Assistant
            </h1>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <PersonaSelector />
            
            <button
              onClick={clearChat}
              className="p-2 rounded-lg border border-indigo-100 dark:border-gray-700/70 hover:border-indigo-200 dark:hover:border-gray-600 transition-colors duration-200 group"
              title="Clear chat"
            >
              <FiTrash2 className="text-gray-600/90 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-purple-400 transition-colors text-sm sm:text-base" />
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-indigo-100 dark:border-gray-700/70 hover:border-indigo-200 dark:hover:border-gray-600 transition-colors duration-200"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <FiMoon className="text-gray-600/90 dark:text-gray-400 text-sm sm:text-base" />
              ) : (
                <FiSun className="text-amber-500/90 text-sm sm:text-base" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-indigo-100 dark:border-gray-700/70 hover:border-indigo-200 dark:hover:border-gray-600 transition-colors duration-200"
            >
              {theme === 'light' ? (
                <FiMoon className="text-gray-600/90 dark:text-gray-400" />
              ) : (
                <FiSun className="text-amber-500/90" />
              )}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-indigo-100 dark:border-gray-700/70 hover:border-indigo-200 dark:hover:border-gray-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <FiX className="text-gray-600/90 dark:text-gray-400" />
              ) : (
                <FiMenu className="text-gray-600/90 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <div className="w-full">
                <PersonaSelector />
              </div>
              <button
                onClick={() => {
                  clearChat();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-700 transition-colors duration-200 text-red-600 dark:text-red-400"
              >
                <FiTrash2 className="text-sm" />
                <span className="text-sm font-medium">Clear Chat</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;