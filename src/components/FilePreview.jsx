// FilePreview.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiFile, FiImage, FiFileText } from 'react-icons/fi';

const FilePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = useState(null);
  const isImage = file.type.startsWith('image/');

  useEffect(() => {
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file, isImage]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = () => {
    if (isImage) return <FiImage className="text-emerald-500 text-sm sm:text-base" />;
    if (file.type === 'application/pdf') return <FiFileText className="text-red-500 text-sm sm:text-base" />;
    return <FiFile className="text-blue-500 text-sm sm:text-base" />;
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-slate-700 
                    rounded-lg border border-slate-200 dark:border-slate-600 
                    hover:border-violet-300 dark:hover:border-violet-600 
                    transition-all duration-200">
        {isImage && preview ? (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden flex-shrink-0">
            <img 
              src={preview} 
              alt={file.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                        bg-slate-100 dark:bg-slate-600 rounded flex-shrink-0">
            {getFileIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 
                      truncate max-w-[100px] sm:max-w-[150px]">
            {file.name}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
            {formatFileSize(file.size)}
          </p>
        </div>
        
        <button
          onClick={onRemove}
          className="p-0.5 sm:p-1 rounded-full bg-slate-100 dark:bg-slate-600 
                   hover:bg-rose-100 dark:hover:bg-rose-900/30
                   text-slate-500 hover:text-rose-500 
                   dark:text-slate-400 dark:hover:text-rose-400
                   transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
        >
          <FiX className="text-xs sm:text-sm" />
        </button>
      </div>
    </div>
  );
};

export default FilePreview;