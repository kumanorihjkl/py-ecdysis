import React, { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import * as Tabs from '@radix-ui/react-tabs';

export const OutputPanel: React.FC = () => {
  const { execution } = useStore();
  const outputRef = useRef<HTMLPreElement>(null);
  const variablesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [execution.output]);

  const renderVariableValue = (value: any): string => {
    if (typeof value === 'string') {
      return `"${value}"`;
    } else if (Array.isArray(value)) {
      return `[${value.map(v => renderVariableValue(v)).join(', ')}]`;
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 h-full overflow-hidden">
      <Tabs.Root defaultValue="output" className="flex-1 flex flex-col h-full">
        <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Tabs.Trigger
            value="output"
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-python-blue dark:data-[state=active]:text-python-yellow data-[state=active]:border-b-2 data-[state=active]:border-python-blue dark:data-[state=active]:border-python-yellow transition-colors"
          >
            出力
          </Tabs.Trigger>
          <Tabs.Trigger
            value="variables"
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-python-blue dark:data-[state=active]:text-python-yellow data-[state=active]:border-b-2 data-[state=active]:border-python-blue dark:data-[state=active]:border-python-yellow transition-colors"
          >
            変数
          </Tabs.Trigger>
          {execution.isRunning && (
            <div className="ml-auto px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">実行中...</span>
            </div>
          )}
        </Tabs.List>

        <Tabs.Content value="output" className="flex-1 overflow-hidden">
          <div className="h-full p-4 overflow-auto">
            {execution.error ? (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                  エラー
                </h3>
                <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono">
                  {execution.error}
                </pre>
              </div>
            ) : execution.output ? (
              <pre
                ref={outputRef}
                className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono"
              >
                {execution.output}
              </pre>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                コードを実行すると、ここに出力が表示されます。
              </div>
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="variables" className="flex-1 overflow-hidden">
          <div ref={variablesRef} className="h-full p-4 overflow-auto">
            {Object.keys(execution.variables).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(execution.variables).map(([name, value]) => (
                  <div
                    key={name}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3"
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-sm font-semibold text-python-blue dark:text-python-yellow">
                        {name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {typeof value === 'string' && value.startsWith('<class')
                          ? value
                          : `(${typeof value})`}
                      </span>
                    </div>
                    {typeof value !== 'string' || !value.startsWith('<class') ? (
                      <pre className="mt-1 text-xs text-gray-700 dark:text-gray-300 font-mono overflow-x-auto">
                        {renderVariableValue(value)}
                      </pre>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                コードを実行すると、ここに変数が表示されます。
                {execution.stepMode && (
                  <p className="mt-2 text-xs">
                    ステップ実行モードが有効です。各ステップで変数の状態を確認できます。
                  </p>
                )}
              </div>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
