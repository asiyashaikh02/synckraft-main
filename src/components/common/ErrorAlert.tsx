import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorAlert = ({ 
  title = "Connection Error", 
  message = "Failed to synchronize data with the server. Please check your permissions or network connection.",
  onRetry 
}: ErrorAlertProps) => (
  <div className="p-8 max-w-2xl mx-auto">
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm border-l-4 border-l-red-500 animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-start space-x-4">
        <div className="bg-red-100 p-2 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-red-900 font-bold text-lg mb-1">{title}</h3>
          <p className="text-red-700/80 text-sm leading-relaxed mb-4">{message}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
