import { useState, useCallback } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const [clipError, setClipError] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      const { default: clipboardy } = await import('clipboardy');
      await clipboardy.write(text);
      setCopied(true);
      setClipError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setClipError('Failed to copy to clipboard');
      setTimeout(() => setClipError(null), 3000);
    }
  }, []);

  return { copied, clipError, copyToClipboard };
}
