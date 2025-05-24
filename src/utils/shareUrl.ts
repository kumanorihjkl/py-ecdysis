import { ungzip } from 'pako';

export interface ShareData {
  code: string;
  fileName: string;
  timestamp: number;
}

export const parseShareUrl = (): ShareData | null => {
  try {
    const url = new URL(window.location.href);
    const shareParam = url.searchParams.get('share');
    
    if (!shareParam) {
      return null;
    }
    
    // Decode base64
    const binaryString = atob(shareParam);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decompress
    const decompressed = ungzip(bytes);
    const jsonStr = new TextDecoder().decode(decompressed);
    
    // Parse JSON
    const data = JSON.parse(jsonStr) as ShareData;
    
    return data;
  } catch (error) {
    console.error('Failed to parse share URL:', error);
    return null;
  }
};
