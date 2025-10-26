import React from "react";
import {
  FiUser,
  FiX,
  FiVolume2,
  FiFile,
  FiImage,
  FiFileText,
} from "react-icons/fi";
import { useChat } from "../context/ChatContext";
import { AI_PERSONAS } from "../config";

const ChatMessage = ({ message }) => {
  const { deleteMessage } = useChat();

  const isUser = message?.role === "user";
  const persona =
    (message?.persona && AI_PERSONAS[message.persona]) || AI_PERSONAS.assistant;

  const getPersonaColor = (color) =>
    ({
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      pink: "from-pink-500 to-pink-600",
      indigo: "from-indigo-500 to-indigo-600",
      teal: "from-teal-500 to-teal-600",
    }[color] || "from-gray-500 to-gray-600");

  const getFileIcon = (fileType, fileName) =>
    fileType.startsWith("image/") ? (
      <FiImage className="text-emerald-500 text-sm sm:text-base" />
    ) : fileType === "application/pdf" ? (
      <FiFileText className="text-red-500 text-sm sm:text-base" />
    ) : fileType.startsWith("text/") || fileName?.match(/\.(doc|docx)$/i) ? (
      <FiFileText className="text-blue-500 text-sm sm:text-base" />
    ) : (
      <FiFile className="text-gray-500 text-sm sm:text-base" />
    );

  const speakMessage = () => {
    const text = message?.content || "";
    if (text.trim() && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 sm:mb-4 group px-1`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-1 bg-gradient-to-br ${getPersonaColor(
            persona.color
          )} shadow-md flex-shrink-0`}
        >
          <span className="text-white text-xs sm:text-sm">{persona.avatar}</span>
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[80%] md:max-w-2xl flex-1`}>
        {/* Sender Info */}
        <div
          className={`flex items-center mb-1 ${isUser ? "flex-row-reverse" : ""}`}
        >
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isUser
                ? "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200"
                : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
            }`}
          >
            {isUser ? "You" : persona.name}
          </span>
          <span className="mx-2 text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {message?.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={`relative w-full rounded-2xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-200 hover:shadow-md ${
            isUser
              ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm"
          }`}
        >
          {/* Attached Files */}
          {message?.files?.length > 0 && (
            <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-black/5 dark:bg-white/5 rounded-lg">
              <div className="text-xs font-medium mb-1 sm:mb-2 text-slate-600 dark:text-slate-300">
                Attached Files:
              </div>
              <div className="space-y-1 sm:space-y-2">
                {message.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="p-1 bg-white/10 dark:bg-black/10 rounded flex-shrink-0">
                      {getFileIcon(file.type, file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-xs sm:text-sm">{file.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs">
                        {file.type.split('/')[1]?.toUpperCase() || file.type} • {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
            {message?.content || ""}
          </div>
        </div>

        {/* Mobile Timestamp */}
        <div className="sm:hidden text-xs text-slate-400 dark:text-slate-500 mt-1 px-1">
          {message?.timestamp
            ? new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </div>

        {/* AI Message Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={speakMessage}
              className="p-1 sm:p-1.5 text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Listen to message"
            >
              <FiVolume2 size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              onClick={() => deleteMessage(message?.id)}
              className="p-1 sm:p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Delete message"
            >
              <FiX size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ml-2 sm:ml-3 mt-1 bg-gradient-to-br from-slate-500 to-slate-600 shadow-md flex-shrink-0">
          <FiUser className="text-white text-xs sm:text-sm" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;