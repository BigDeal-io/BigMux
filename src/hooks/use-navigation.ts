import { useState, useCallback, useMemo } from 'react';
import type { Screen } from '../types.js';
import { SCREEN_LABELS } from '../types.js';

export interface Navigation {
  current: Screen;
  stack: Screen[];
  breadcrumbs: string[];
  push: (screen: Screen) => void;
  pop: () => void;
  replace: (screen: Screen) => void;
}

export function useNavigation(): Navigation {
  const [stack, setStack] = useState<Screen[]>([{ type: 'main-menu' }]);

  const current = stack[stack.length - 1]!;

  const breadcrumbs = useMemo(
    () => stack.map(s => SCREEN_LABELS[s.type]),
    [stack],
  );

  const push = useCallback((screen: Screen) => {
    setStack(prev => [...prev, screen]);
  }, []);

  const pop = useCallback(() => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const replace = useCallback((screen: Screen) => {
    setStack(prev => [...prev.slice(0, -1), screen]);
  }, []);

  return { current, stack, breadcrumbs, push, pop, replace };
}
