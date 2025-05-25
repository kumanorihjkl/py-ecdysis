import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '../store/useStore';
import { usePyodide } from '../hooks/usePyodide';
import { tutorials } from '../data/tutorials';

export const TutorialPanel: React.FC = () => {
  const { tutorial, setCurrentTutorialStep, completeTutorialStep, setCode } = useStore();
  const { runCode } = usePyodide();
  
  const currentTutorial = tutorials[tutorial.currentStep];
  const isCompleted = tutorial.completedSteps.includes(tutorial.currentStep);
  const canProceed = tutorial.currentStep < tutorials.length - 1;
  const canGoBack = tutorial.currentStep > 0;

  useEffect(() => {
    // Load tutorial code when step changes
    if (currentTutorial?.code) {
      setCode(currentTutorial.code);
    }
  }, [tutorial.currentStep, currentTutorial, setCode]);

  const handleRunCode = async () => {
    await runCode(currentTutorial.code);
    
    // Check if the tutorial step is completed
    // In a real implementation, you would check the output or test results
    completeTutorialStep(tutorial.currentStep);
  };

  const handleNext = () => {
    if (canProceed) {
      setCurrentTutorialStep(tutorial.currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentTutorialStep(tutorial.currentStep - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentTutorial?.title || 'チュートリアル'}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {tutorial.currentStep + 1} / {tutorials.length}
            </span>
            {isCompleted && (
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                完了
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {currentTutorial?.content || ''}
            </ReactMarkdown>
          </div>

          {currentTutorial?.code && (
            <div className="mt-6">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    サンプルコード
                  </h3>
                  <button
                    onClick={handleRunCode}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  >
                    実行
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{currentTutorial.code}</code>
                </pre>
              </div>
            </div>
          )}

          {currentTutorial?.exercise && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                練習問題
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentTutorial.exercise}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={!canGoBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            前へ
          </button>

            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                {tutorials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTutorialStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                  index === tutorial.currentStep
                    ? 'bg-python-blue dark:bg-python-yellow'
                    : tutorial.completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`ステップ ${index + 1}`}
                />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} <a href="https://github.com/kumanorihjkl">kumanorihjkl</a>
              </span>
            </div>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-4 py-2 text-sm font-medium text-white bg-python-blue hover:bg-blue-700 disabled:bg-gray-400 rounded-md disabled:cursor-not-allowed transition-colors"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
};
