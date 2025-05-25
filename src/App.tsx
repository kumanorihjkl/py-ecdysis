import { useEffect } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { OutputPanel } from './components/OutputPanel';
import { TutorialPanel } from './components/TutorialPanel';
import { useStore } from './store/useStore';
import { usePyodide } from './hooks/usePyodide';
import { useFileSystem } from './hooks/useFileSystem';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { LoadingScreen } from './components/LoadingScreen';
import { parseShareUrl } from './utils/shareUrl';

function App() {
  const { theme } = useStore();
  const { isLoading, error } = usePyodide();
  const { initFileSystem } = useFileSystem();

  useKeyboardShortcuts();

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    initFileSystem();
    
    // Check for shared URL
    const sharedData = parseShareUrl();
    if (sharedData) {
      const { setCode, setFileName } = useStore.getState();
      setCode(sharedData.code);
      setFileName(sharedData.fileName);
      
      // Clear the URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('share');
      window.history.replaceState({}, '', url.toString());
    }
  }, [initFileSystem]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            初期化エラー
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            ページを再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex">
          {/* Left Panel - Tutorial */}
          <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
            <TutorialPanel />
          </div>
          
          {/* Right Panel - Editor and Output stacked vertically */}
          <div className="w-1/2 flex flex-col">
            {/* Top - Editor */}
            <div className="h-1/2 flex flex-col border-b border-gray-200 dark:border-gray-700">
              <Editor />
            </div>
            
            {/* Bottom - Output */}
            <div className="h-1/2 flex flex-col">
              <OutputPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
