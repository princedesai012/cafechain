import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Popup = ({ isOpen, onClose, type = 'error', title, message }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    if (type === 'success') {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    return <AlertCircle className="w-6 h-6 text-red-500" />;
  };

  const getBgColor = () => {
    if (type === 'success') {
      return 'bg-green-50 border-green-200';
    }
    return 'bg-red-50 border-red-200';
  };

  const getTextColor = () => {
    if (type === 'success') {
      return 'text-green-800';
    }
    return 'text-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${getBgColor()} border rounded-xl p-6 max-w-sm w-full shadow-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getIcon()}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${getTextColor()} mb-1`}>
                {title}
              </h3>
              <p className={`text-sm ${getTextColor()}`}>
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'success' 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
