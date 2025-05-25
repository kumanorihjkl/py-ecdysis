import React, { useRef, useCallback, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { useFileSystem } from '../hooks/useFileSystem';
import { usePyodide } from '../hooks/usePyodide';
import { editorEvents } from '../utils/editorEvents';
import type { editor } from 'monaco-editor';

export const Editor: React.FC = () => {
  const { code, setCode, fileName, theme, execution } = useStore();
  const { handleFileUpload } = useFileSystem();
  const { installPackage } = usePyodide();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen for resize events and update editor layout
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      // Clear any existing timeout
      clearTimeout(resizeTimeout);
      
      // Delay the layout update to ensure DOM has updated
      resizeTimeout = setTimeout(() => {
        if (editorRef.current) {
          // Force Monaco Editor to recalculate its layout
          editorRef.current.layout();
          
          // Also trigger a second layout update after a short delay
          // to handle any async rendering issues
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.layout();
            }
          }, 100);
        }
      }, 50);
    };

    // Listen to custom resize events
    editorEvents.addEventListener('resize', handleResize);

    // Also listen to window resize events
    window.addEventListener('resize', handleResize);

    // Use ResizeObserver to detect container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(resizeTimeout);
      editorEvents.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleFileDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.py')) {
        await handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleInstallPackage = async () => {
    const packageName = prompt('インストールするパッケージ名を入力してください:');
    if (packageName) {
      try {
        useStore.getState().appendOutput(`Installing ${packageName}...\n`);
        await installPackage(packageName);
        useStore.getState().appendOutput(`Successfully installed ${packageName}\n`);
      } catch (error: any) {
        useStore.getState().appendOutput(`Error: ${error.message}\n`);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" onDrop={handleFileDrop} onDragOver={handleDragOver}>
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {fileName}
          </span>
          {execution.currentLine !== null && (
            <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded">
              実行中: {execution.currentLine + 1}行目
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleInstallPackage}
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
          >
            パッケージ追加
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".py"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
          >
            ファイルを開く
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <MonacoEditor
            height="100%"
            width="100%"
          language="python"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: false,
            tabSize: 4,
            wordWrap: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
          }}
          beforeMount={(monaco) => {
            // Configure Python language features
            monaco.languages.setLanguageConfiguration('python', {
              comments: {
                lineComment: '#',
              },
              brackets: [
                ['{', '}'],
                ['[', ']'],
                ['(', ')'],
              ],
              autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
                { open: "'", close: "'" },
              ],
              surroundingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
                { open: "'", close: "'" },
              ],
              indentationRules: {
                increaseIndentPattern: /^.*:\s*$/,
                decreaseIndentPattern: /^\s*(elif|else|except|finally).*:\s*$/,
              },
            });
          }}
          onMount={(editor, monaco) => {
            // Store editor instance
            editorRef.current = editor;
            
            // Force initial layout
            setTimeout(() => {
              editor.layout();
            }, 0);
            
            // Add line decorations for step execution
            if (execution.currentLine !== null) {
              editor.deltaDecorations(
                [],
                [
                  {
                    range: new monaco.Range(
                      execution.currentLine + 1,
                      1,
                      execution.currentLine + 1,
                      1
                    ),
                    options: {
                      isWholeLine: true,
                      className: 'bg-yellow-200 dark:bg-yellow-900',
                      glyphMarginClassName: 'bg-yellow-500',
                    },
                  },
                ]
              );
            }
          }}
          />
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 dark:text-gray-600 pointer-events-none">
        ドラッグ&ドロップでファイルを開く
      </div>
    </div>
  );
};
