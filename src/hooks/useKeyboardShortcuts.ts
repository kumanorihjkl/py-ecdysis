import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { usePyodide } from './usePyodide';

export const useKeyboardShortcuts = () => {
  const { code, execution } = useStore();
  const { runCode } = usePyodide();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter: Run code
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!execution.isRunning) {
          runCode(code);
        }
      }

      // Cmd/Ctrl + S: Save (prevent default browser save)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        // File is auto-saved, so just show a notification or do nothing
      }

      // Cmd/Ctrl + Shift + D: Toggle dark mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const { theme, setTheme } = useStore.getState();
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }

      // Escape: Stop execution
      if (e.key === 'Escape' && execution.isRunning) {
        e.preventDefault();
        // Note: Pyodide doesn't support interrupting execution
        // This is a placeholder for future implementation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, execution.isRunning, runCode]);
};
