import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-python-blue rounded-full animate-pulse"></div>
          <div className="absolute inset-2 border-4 border-python-yellow rounded-full animate-pulse-slow"></div>
          <div className="absolute inset-4 border-4 border-python-blue rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Py-Ecdysis</h1>
        <p className="text-gray-400 mb-4">Python学習環境を初期化中...</p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-python-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-python-yellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-python-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-8">
          Pyodide (CPython 3.12 WASM) をロード中...
        </p>
      </div>
    </div>
  );
};
