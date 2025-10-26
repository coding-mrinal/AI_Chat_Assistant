import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { AI_PERSONAS } from '../config';
import { useChat } from '../context/ChatContext';

const PersonaSelector = () => {
  const { selectedPersona, updatePersona } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const currentPersona = AI_PERSONAS[selectedPersona];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.persona-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 dark:bg-blue-600',
      green: 'bg-green-500 dark:bg-green-600',
      purple: 'bg-purple-500 dark:bg-purple-600',
      pink: 'bg-pink-500 dark:bg-pink-600',
      indigo: 'bg-indigo-500 dark:bg-indigo-600',
      teal: 'bg-teal-500 dark:bg-teal-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="relative persona-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 rounded-lg
                 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                 w-full md:w-auto min-w-0"
      >
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${getColorClasses(currentPersona.color)} 
                      flex items-center justify-center text-white flex-shrink-0`}>
          <span className="text-sm sm:text-lg">{currentPersona.avatar}</span>
        </div>
        <div className="text-left min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {currentPersona.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:block">
            {currentPersona.description}
          </div>
        </div>
        <FiChevronDown className={`text-gray-400 transition-transform flex-shrink-0 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50
                      max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase">
              Choose AI Persona
            </div>
            {Object.values(AI_PERSONAS).map((persona) => (
              <button
                key={persona.id}
                onClick={() => {
                  updatePersona(persona.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                         ${selectedPersona === persona.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${getColorClasses(persona.color)} 
                              flex items-center justify-center text-white flex-shrink-0`}>
                  <span className="text-base sm:text-xl">{persona.avatar}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {persona.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {persona.description}
                  </div>
                </div>
                {selectedPersona === persona.id && (
                  <FiCheck className="text-green-500 flex-shrink-0 text-sm sm:text-base" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;