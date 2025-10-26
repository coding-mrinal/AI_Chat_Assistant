import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiX, FiImage, FiFile } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import FilePreview from './FilePreview';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const { isLoading } = useChat();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || attachedFiles.length > 0) && !isLoading) {
      onSendMessage(message, attachedFiles);
      setMessage('');
      setAttachedFiles([]);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      (file.type.startsWith('image/') || 
       file.type === 'application/pdf' || 
       file.type.startsWith('text/') || 
       file.name.match(/\.(doc|docx)$/i)) && 
      file.size <= 10485760 // 10MB
    );
    
    if (validFiles.length !== files.length) {
      console.warn('Some files were rejected due to size or type restrictions');
    }
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 shadow-lg transition-all duration-300">
      <div className="max-w-6xl mx-auto p-3 sm:p-4">
        {/* File Previews */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                Attached Files ({attachedFiles.length})
              </span>
              <button 
                onClick={() => setAttachedFiles([])} 
                className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <FilePreview key={index} file={file} onRemove={() => removeFile(index)} />
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-end gap-2 sm:gap-3">
            {/* File Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 sm:p-3 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 
                       hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl 
                       transition-all duration-200 flex-shrink-0
                       disabled:opacity-50 disabled:cursor-not-allowed"
              title="Attach files"
              disabled={isLoading}
            >
              <FiPaperclip className="text-lg sm:text-xl" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Message Textarea */}
            <div className="flex-1 relative min-w-0">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
                disabled={isLoading}
                rows="1"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-xl 
                         bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 
                         text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 
                         focus:outline-none focus:ring-3 focus:ring-violet-500/20 focus:border-violet-500 
                         dark:focus:border-violet-400 resize-none shadow-sm 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
                         text-sm sm:text-base max-h-32 overflow-y-auto"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  minHeight: '44px'
                }}
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!message.trim() && attachedFiles.length === 0) || isLoading}
              className="p-2.5 sm:p-3.5 bg-gradient-to-r from-violet-600 to-purple-600 
                       hover:from-violet-700 hover:to-purple-700 dark:from-violet-500 dark:to-purple-500 
                       dark:hover:from-violet-600 dark:hover:to-purple-600 text-white rounded-xl sm:rounded-2xl 
                       shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-200 transform hover:scale-105 focus:outline-none 
                       focus:ring-3 focus:ring-violet-500/20 flex-shrink-0"
            >
              <FiSend className="text-lg sm:text-xl" />
            </button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 sm:gap-2">
            <FiImage className="text-xs sm:text-sm flex-shrink-0" />
            <span className="text-xs">Images, PDF, TXT, DOC (Max 10MB)</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1 rounded-full text-xs">
            Press <kbd className="px-1.5 py-0.5 mx-1 text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded shadow-sm">Enter</kbd> to send
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;