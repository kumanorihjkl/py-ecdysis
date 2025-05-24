import { useCallback, useEffect } from 'react';
import { openDB, DBSchema } from 'idb';
import { useStore } from '../store/useStore';

interface FileSystemDB extends DBSchema {
  files: {
    key: string;
    value: {
      path: string;
      content: string;
      lastModified: number;
    };
  };
}

const DB_NAME = 'py-ecdysis-fs';
const DB_VERSION = 1;

export const useFileSystem = () => {
  const { code, fileName, setCode, setFileName } = useStore();

  // Initialize IndexedDB
  const getDB = useCallback(async () => {
    return openDB<FileSystemDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'path' });
        }
      },
    });
  }, []);

  // Save file to IndexedDB
  const saveFile = useCallback(async (path: string, content: string) => {
    const db = await getDB();
    await db.put('files', {
      path,
      content,
      lastModified: Date.now(),
    });
  }, [getDB]);

  // Load file from IndexedDB
  const loadFile = useCallback(async (path: string) => {
    const db = await getDB();
    const file = await db.get('files', path);
    return file?.content || null;
  }, [getDB]);

  // List all files
  const listFiles = useCallback(async () => {
    const db = await getDB();
    const files = await db.getAll('files');
    return files.map(f => ({
      path: f.path,
      lastModified: f.lastModified,
    }));
  }, [getDB]);

  // Delete file
  const deleteFile = useCallback(async (path: string) => {
    const db = await getDB();
    await db.delete('files', path);
  }, [getDB]);

  // Auto-save current file
  useEffect(() => {
    const autoSave = async () => {
      if (fileName && code) {
        await saveFile(fileName, code);
      }
    };

    const timeoutId = setTimeout(autoSave, 1000); // Auto-save after 1 second of inactivity
    return () => clearTimeout(timeoutId);
  }, [code, fileName, saveFile]);

  // Initialize file system
  const initFileSystem = useCallback(async () => {
    // Check if there's a saved file to restore
    const files = await listFiles();
    if (files.length > 0 && !code) {
      // Load the most recently modified file
      const mostRecent = files.sort((a, b) => b.lastModified - a.lastModified)[0];
      const content = await loadFile(mostRecent.path);
      if (content) {
        setCode(content);
        setFileName(mostRecent.path);
      }
    }
  }, [listFiles, loadFile, code, setCode, setFileName]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        if (content) {
          await saveFile(file.name, content);
          setFileName(file.name);
          setCode(content);
          resolve(content);
        } else {
          reject(new Error('ファイルの読み込みに失敗しました'));
        }
      };
      reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
      reader.readAsText(file);
    });
  }, [saveFile, setFileName, setCode]);

  // Export file
  const exportFile = useCallback((filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return {
    saveFile,
    loadFile,
    listFiles,
    deleteFile,
    handleFileUpload,
    exportFile,
    initFileSystem,
  };
};
