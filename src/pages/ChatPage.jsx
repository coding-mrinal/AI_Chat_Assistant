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
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'nearest'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  return (
    <div className="flex-1 flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {/* Main Chat Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto chat-scrollbar min-h-0"
        >
          <div className="max-w-6xl mx-auto w-full px-3 sm:px-4 py-4 md:py-6">
            {messages.length === 0 && !isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[50vh] md:min-h-[60vh]">
                <div className="text-center px-4">
                  <div className="text-5xl sm:text-6xl md:text-7xl mb-4 md:mb-6">🤖</div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                    Welcome to AI Chat!
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Choose a persona and start a conversation with AI
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
                            rounded-lg text-red-700 dark:text-red-300 text-sm sm:text-base">
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4 sm:h-6" />
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0">
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;