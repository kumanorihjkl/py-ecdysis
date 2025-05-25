import { useEffect, useState, useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

export const usePyodide = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<any>(null);
  const micropipRef = useRef<any>(null);
  
  const { 
    setOutput, 
    appendOutput, 
    setError: setExecutionError,
    setIsRunning,
    setVariables,
    execution
  } = useStore();

  // Initialize Pyodide
  useEffect(() => {
    const initPyodide = async () => {
      try {
        setIsLoading(true);
        
        // Load Pyodide script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js';
        script.async = true;
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        // Initialize Pyodide
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/',
          // stdoutとstderrのフックを削除し、Python側のカスタムprint関数に任せる
          // stdout: (text: string) => {
          //   appendOutput(text + '\n');
          // },
          // stderr: (text: string) => {
          //   appendOutput(`[stderr] ${text}\n`);
          // },
        });

        // Load micropip
        await pyodide.loadPackage('micropip');
        const micropip = pyodide.pyimport('micropip');
        
        // Set up Python environment
        await pyodide.runPythonAsync(`
import sys
import io
from contextlib import redirect_stdout, redirect_stderr

# Custom print function to capture output
_original_print = print
_output_buffer = []

def custom_print(*args, **kwargs):
    output = io.StringIO()
    _original_print(*args, file=output, **kwargs)
    _output_buffer.append(output.getvalue())
    _original_print(*args, **kwargs)

print = custom_print

# Function to get buffered output
def get_output():
    global _output_buffer
    result = ''.join(_output_buffer)
    _output_buffer = []
    return result

# Function to get all variables (excluding built-ins and imports)
def get_variables():
    import json
    vars_dict = {}
    for name, value in globals().items():
        if not name.startswith('_') and name not in ['__builtins__', 'sys', 'io', 'json', 'redirect_stdout', 'redirect_stderr', 'custom_print', 'get_output', 'get_variables']:
            try:
                # Try to convert to JSON-serializable format
                if isinstance(value, (int, float, str, bool, list, dict, tuple, type(None))):
                    vars_dict[name] = value
                else:
                    vars_dict[name] = str(type(value))
            except:
                vars_dict[name] = '<unable to serialize>'
    return json.dumps(vars_dict)
        `);

        pyodideRef.current = pyodide;
        micropipRef.current = micropip;
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize Pyodide:', err);
        setError('Pyodideの初期化に失敗しました。ページを再読み込みしてください。');
        setIsLoading(false);
      }
    };

    initPyodide();
  }, []);

  // Run Python code
  const runCode = useCallback(async (code: string) => {
    if (!pyodideRef.current) {
      setExecutionError('Pyodideが初期化されていません');
      return;
    }

    setIsRunning(true);
    setExecutionError(null);
    setOutput('');
    
    try {
      // Clear previous output buffer
      await pyodideRef.current.runPythonAsync('_output_buffer = []');
      
      // Run the code
      await pyodideRef.current.runPythonAsync(code);
      
      // Get any buffered output
      const bufferedOutput = await pyodideRef.current.runPythonAsync('get_output()');
      if (bufferedOutput) {
        appendOutput(bufferedOutput);
      }
      
      // Get variables
      const varsJson = await pyodideRef.current.runPythonAsync('get_variables()');
      const variables = JSON.parse(varsJson);
      setVariables(variables);
      
    } catch (err: any) {
      setExecutionError(err.message || 'コードの実行中にエラーが発生しました');
    } finally {
      setIsRunning(false);
    }
  }, [setOutput, appendOutput, setExecutionError, setIsRunning, setVariables]);

  // Install package using micropip
  const installPackage = useCallback(async (packageName: string) => {
    if (!micropipRef.current) {
      throw new Error('micropipが初期化されていません');
    }

    try {
      await micropipRef.current.install(packageName);
      return true;
    } catch (err: any) {
      if (err.message.includes('C extension')) {
        throw new Error(`${packageName} はC拡張を含むため、ブラウザ環境では利用できません`);
      }
      throw err;
    }
  }, []);

  // Run code step by step
  const runStepByStep = useCallback(async (code: string, onStep: (line: number, vars: any) => void) => {
    if (!pyodideRef.current) {
      setExecutionError('Pyodideが初期化されていません');
      return;
    }

    setIsRunning(true);
    setExecutionError(null);
    
    try {
      const lines = code.split('\n');
      let accumulatedCode = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith('#')) {
          continue;
        }
        
        accumulatedCode += line + '\n';
        
        // Check if we have a complete statement
        try {
          await pyodideRef.current.runPythonAsync(`
compile('''${accumulatedCode}''', '<string>', 'exec')
          `);
          
          // Run the accumulated code
          await pyodideRef.current.runPythonAsync(accumulatedCode);
          
          // Get variables
          const varsJson = await pyodideRef.current.runPythonAsync('get_variables()');
          const variables = JSON.parse(varsJson);
          
          // Get output
          const output = await pyodideRef.current.runPythonAsync('get_output()');
          if (output) {
            appendOutput(output);
          }
          
          // Callback for each step
          await onStep(i, variables);
          
          // Reset accumulated code
          accumulatedCode = '';
        } catch (syntaxErr: any) {
          // If it's a syntax error because statement is incomplete, continue accumulating
          if (syntaxErr.message.includes('unexpected EOF') || syntaxErr.message.includes('SyntaxError')) {
            continue;
          }
          throw syntaxErr;
        }
      }
    } catch (err: any) {
      setExecutionError(err.message || 'ステップ実行中にエラーが発生しました');
    } finally {
      setIsRunning(false);
    }
  }, [setExecutionError, setIsRunning, appendOutput]);

  return {
    isLoading,
    error,
    runCode,
    installPackage,
    runStepByStep,
    pyodide: pyodideRef.current,
  };
};
