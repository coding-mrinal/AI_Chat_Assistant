import React from 'react';
import ChatHeader from './components/ChatHeader';
import ChatPage from './pages/ChatPage';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <ChatHeader />
        <ChatPage />
      </div>
    </ChatProvider>
  );
}

export default App;