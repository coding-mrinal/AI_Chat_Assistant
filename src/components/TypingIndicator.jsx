import React from 'react';
import { FiCpu } from 'react-icons/fi';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3 max-w-3xl">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 
                      flex items-center justify-center">
          <FiCpu className="text-white text-sm" />
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full 
                          animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full 
                          animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full 
                          animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;