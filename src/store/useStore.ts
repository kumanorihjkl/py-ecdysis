import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export type ActiveTab = 'editor' | 'tutorial';
export type LayoutMode = 'single' | 'split';

interface ExecutionState {
  isRunning: boolean;
  output: string;
  error: string | null;
  currentLine: number | null;
  variables: Record<string, any>;
  stepMode: boolean;
}

interface TutorialState {
  currentStep: number;
  completedSteps: number[];
  tutorialCode: string;
}

interface AppState {
  // UI State
  theme: Theme;
  activeTab: ActiveTab;
  layoutMode: LayoutMode;
  
  // Editor State
  code: string;
  fileName: string;
  
  // Execution State
  execution: ExecutionState;
  
  // Tutorial State
  tutorial: TutorialState;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setCode: (code: string) => void;
  setFileName: (name: string) => void;
  setOutput: (output: string) => void;
  appendOutput: (output: string) => void;
  setError: (error: string | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setCurrentLine: (line: number | null) => void;
  setVariables: (variables: Record<string, any>) => void;
  setStepMode: (enabled: boolean) => void;
  setCurrentTutorialStep: (step: number) => void;
  completeTutorialStep: (step: number) => void;
  setTutorialCode: (code: string) => void;
  resetExecution: () => void;
}

const initialExecutionState: ExecutionState = {
  isRunning: false,
  output: '',
  error: null,
  currentLine: null,
  variables: {},
  stepMode: false,
};

const initialTutorialState: TutorialState = {
  currentStep: 0,
  completedSteps: [],
  tutorialCode: '',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      theme: 'dark',
      activeTab: 'editor',
      layoutMode: 'single',
      code: '# Python学習環境へようこそ！\n# ここにPythonコードを入力してください\n\nprint("Hello, Python!")\n',
      fileName: 'main.py',
      execution: initialExecutionState,
      tutorial: initialTutorialState,
      
      // Actions
      setTheme: (theme) => set({ theme }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),
      setCode: (code) => set({ code }),
      setFileName: (fileName) => set({ fileName }),
      setOutput: (output) => set((state) => ({
        execution: { ...state.execution, output }
      })),
      appendOutput: (output) => set((state) => ({
        execution: { ...state.execution, output: state.execution.output + output }
      })),
      setError: (error) => set((state) => ({
        execution: { ...state.execution, error }
      })),
      setIsRunning: (isRunning) => set((state) => ({
        execution: { ...state.execution, isRunning }
      })),
      setCurrentLine: (currentLine) => set((state) => ({
        execution: { ...state.execution, currentLine }
      })),
      setVariables: (variables) => set((state) => ({
        execution: { ...state.execution, variables }
      })),
      setStepMode: (stepMode) => set((state) => ({
        execution: { ...state.execution, stepMode }
      })),
      setCurrentTutorialStep: (currentStep) => set((state) => ({
        tutorial: { ...state.tutorial, currentStep }
      })),
      completeTutorialStep: (step) => set((state) => ({
        tutorial: {
          ...state.tutorial,
          completedSteps: [...new Set([...state.tutorial.completedSteps, step])]
        }
      })),
      setTutorialCode: (tutorialCode) => set((state) => ({
        tutorial: { ...state.tutorial, tutorialCode }
      })),
      resetExecution: () => set((state) => ({
        execution: { ...initialExecutionState, stepMode: state.execution.stepMode }
      })),
    }),
    {
      name: 'py-ecdysis-storage',
      partialize: (state) => ({
        theme: state.theme,
        code: state.code,
        fileName: state.fileName,
        tutorial: state.tutorial,
        layoutMode: state.layoutMode,
      }),
    }
  )
);
