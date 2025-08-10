import { useCallback } from 'react';
import { useChat as useChatContext } from '../context/ChatContext';
import geminiService from '../services/geminiService';

export const useChatLogic = () => {
  const { 
    addMessage, 
    setIsLoading, 
    setError, 
    selectedPersona,
  } = useChatContext();

  const sendMessage = useCallback(async (messageText, attachedFiles = []) => {
    if (!messageText.trim() && (!attachedFiles || attachedFiles.length === 0)) return;

    geminiService.setPersona(selectedPersona);

    const userMessage = {
      role: 'user',
      content: messageText,
      files: attachedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))
    };
    addMessage(userMessage);

    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiService.sendMessage(messageText, attachedFiles);
      
      const aiMessage = {
        role: 'assistant',
        content: response,
        persona: selectedPersona,
      };
      addMessage(aiMessage);
    } catch (error) {
      setError(error.message);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        isError: true,
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, setIsLoading, setError, selectedPersona]);

  return { sendMessage };
};