import React from 'react';
import { useStore } from '../store/useStore';
import { usePyodide } from '../hooks/usePyodide';
import { useFileSystem } from '../hooks/useFileSystem';
import { ShareButton } from './ShareButton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Toggle from '@radix-ui/react-toggle';

export const Header: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    activeTab, 
    setActiveTab,
    layoutMode,
    setLayoutMode, 
    code, 
    fileName,
    execution,
    setStepMode
  } = useStore();
  
  const { runCode, runStepByStep } = usePyodide();
  const { exportFile } = useFileSystem();

  const handleRun = () => {
    if (execution.stepMode) {
      runStepByStep(code, async (line, vars) => {
        useStore.getState().setCurrentLine(line);
        useStore.getState().setVariables(vars);
        // Add a small delay for visualization
        await new Promise(resolve => setTimeout(resolve, 500));
      });
    } else {
      runCode(code);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Py-Ecdysis
          </h1>
          
          <div className="flex items-center space-x-2">
            {layoutMode === 'single' ? (
              <>
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'editor'
                      ? 'bg-python-blue text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  エディタ
                </button>
                <button
                  onClick={() => setActiveTab('tutorial')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'tutorial'
                      ? 'bg-python-blue text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  チュートリアル
                </button>
              </>
            ) : (
              <span className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                分割表示モード
              </span>
            )}
            
            <button
              onClick={() => setLayoutMode(layoutMode === 'single' ? 'split' : 'single')}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={layoutMode === 'single' ? '分割表示' : '単一表示'}
            >
              {layoutMode === 'single' ? (
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {(activeTab === 'editor' || layoutMode === 'split') && (
            <>
              <Toggle.Root
                pressed={execution.stepMode}
                onPressedChange={setStepMode}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  execution.stepMode
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                ステップ実行
              </Toggle.Root>

              <button
                onClick={handleRun}
                disabled={execution.isRunning}
                className="flex items-center space-x-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors text-sm font-medium"
              >
                <span>実行</span>
                <kbd className="text-xs bg-green-700 px-1 rounded">⌘⏎</kbd>
              </button>

              <ShareButton />

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item
                      className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                      onSelect={() => exportFile(fileName, code)}
                    >
                      ファイルをダウンロード
                    </DropdownMenu.Item>
                    
                    <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                    
                    <DropdownMenu.Item
                      className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                      onSelect={() => window.open('https://github.com/pyodide/pyodide', '_blank')}
                    >
                      Pyodideについて
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          )}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="テーマ切り替え"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
