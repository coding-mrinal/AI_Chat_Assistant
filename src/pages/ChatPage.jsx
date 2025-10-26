// ChatPage.jsx
import React, { useEffect, useRef } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import { useChat } from '../context/ChatContext';
import { useChatLogic } from '../hooks/useChat';

const ChatPage = () => {
  const { messages, isLoading, error } = useChat();
  const { sendMessage } = useChatLogic();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          <div className="max-w-6xl mx-auto p-2 sm:p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[300px] sm:min-h-[400px]">
                <div className="text-center px-4">
                  <div className="text-4xl sm:text-6xl mb-4">🤖</div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Welcome to AI Chat!
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    Choose a persona and start a conversation
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 
                            border border-red-300 dark:border-red-700 
                            rounded-lg text-sm sm:text-base text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;