import { useState, useEffect, useCallback } from 'react';
import { executeTmuxCommand } from '../core/executor.js';
import { buildListSessions, buildListWindows, buildListPanes, parseSessions, parseWindows, parsePanes } from '../core/tmux.js';
import type { TmuxSession, TmuxWindow, TmuxPane } from '../types.js';

interface UseTmuxResult {
  sessions: TmuxSession[];
  windows: TmuxWindow[];
  panes: TmuxPane[];
  loading: boolean;
  error: string | null;
  refreshSessions: () => void;
  refreshWindows: (session?: string) => void;
  refreshPanes: (target?: string) => void;
}

export function useTmux(): UseTmuxResult {
  const [sessions, setSessions] = useState<TmuxSession[]>([]);
  const [windows, setWindows] = useState<TmuxWindow[]>([]);
  const [panes, setPanes] = useState<TmuxPane[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSessions = useCallback(() => {
    setLoading(true);
    setError(null);
    const result = executeTmuxCommand(buildListSessions());
    if (result.exitCode === 0) {
      setSessions(parseSessions(result.stdout));
    } else {
      // "no server running" is not an error, just means no sessions
      if (result.stderr.includes('no server running') || result.stderr.includes('no sessions')) {
        setSessions([]);
      } else {
        setError(result.stderr);
      }
    }
    setLoading(false);
  }, []);

  const refreshWindows = useCallback((session?: string) => {
    setLoading(true);
    setError(null);
    const result = executeTmuxCommand(buildListWindows(session));
    if (result.exitCode === 0) {
      setWindows(parseWindows(result.stdout));
    } else {
      if (result.stderr.includes('no server running')) {
        setWindows([]);
      } else {
        setError(result.stderr);
      }
    }
    setLoading(false);
  }, []);

  const refreshPanes = useCallback((target?: string) => {
    setLoading(true);
    setError(null);
    const result = executeTmuxCommand(buildListPanes(target));
    if (result.exitCode === 0) {
      setPanes(parsePanes(result.stdout));
    } else {
      if (result.stderr.includes('no server running')) {
        setPanes([]);
      } else {
        setError(result.stderr);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  return { sessions, windows, panes, loading, error, refreshSessions, refreshWindows, refreshPanes };
}
