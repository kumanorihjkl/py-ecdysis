import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { gzip } from 'pako';

export const ShareButton: React.FC = () => {
  const { code, fileName } = useStore();
  const [shareUrl, setShareUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareUrl = () => {
    try {
      // Create share data object
      const shareData = {
        code,
        fileName,
        timestamp: Date.now(),
      };

      // Convert to JSON and compress
      const jsonStr = JSON.stringify(shareData);
      const compressed = gzip(jsonStr);
      
      // Convert to base64
      const base64 = btoa(String.fromCharCode(...compressed));
      
      // Create URL
      const url = new URL(window.location.href);
      url.searchParams.set('share', base64);
      
      setShareUrl(url.toString());
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to generate share URL:', error);
      alert('共有URLの生成に失敗しました');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={generateShareUrl}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.062 18 14.518 18 14c0-.482.114-.938.316-1.342m0 2.684a3 3 0 110-2.684M9.316 10.658C9.518 10.254 9.632 9.798 9.632 9.316c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.746 12.482 18.632 12.938 18.632 13.42c0 .482.114.938.316 1.342m0-2.684a3 3 0 110 2.684" />
              </svg>
              <span>共有</span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-gray-900 text-white text-xs rounded px-2 py-1"
              sideOffset={5}
            >
              コードを共有URLとして生成
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              共有URLを生成しました
            </Dialog.Title>
            
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  以下のURLをコピーして共有してください：
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    {copied ? 'コピー済み' : 'コピー'}
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ※ URLにはコードとファイル名が圧縮されて含まれています。
                個人情報や機密情報が含まれていないことを確認してから共有してください。
              </p>
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
