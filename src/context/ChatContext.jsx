import React, { createContext, useContext, useState, useEffect } from 'react';
import { config, AI_PERSONAS } from '../config';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  const [selectedPersona, setSelectedPersona] = useState('assistant');

  useEffect(() => {
    const savedTheme = localStorage.getItem(config.THEME_STORAGE_KEY) || 'light';
    const savedPersona = localStorage.getItem(config.PERSONA_STORAGE_KEY) || 'assistant';

    setTheme(savedTheme);
    setSelectedPersona(savedPersona);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem(config.LOCAL_STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(config.LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(config.PERSONA_STORAGE_KEY, selectedPersona);
  }, [selectedPersona]);


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(config.THEME_STORAGE_KEY, newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      persona: message.role === 'assistant' ? selectedPersona : undefined,
    }]);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(config.LOCAL_STORAGE_KEY);
  };

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const updatePersona = (personaId) => {
    if (AI_PERSONAS[personaId]) {
      setSelectedPersona(personaId);
    }
  };


  const value = {
    messages,
    isLoading,
    error,
    theme,
    selectedPersona,
    setIsLoading,
    setError,
    addMessage,
    clearChat,
    deleteMessage,
    toggleTheme,
    updatePersona,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};