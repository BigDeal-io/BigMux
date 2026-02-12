import { useMemo } from 'react';
import { formatCommandForDisplay } from '../core/tmux.js';

export function useCommandPreview(builder: () => string[] | null): string {
  return useMemo(() => {
    const args = builder();
    if (!args) return '';
    return formatCommandForDisplay(args);
  }, [builder]);
}
