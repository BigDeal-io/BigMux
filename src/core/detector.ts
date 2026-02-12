import { execFileSync } from 'child_process';
import type { TmuxEnvironment } from '../types.js';

export function detectTmuxEnvironment(): TmuxEnvironment {
  const isInsideTmux = !!process.env['TMUX'];
  let currentSession: string | undefined;

  if (isInsideTmux) {
    const tmuxEnv = process.env['TMUX'] ?? '';
    // TMUX env var format: /path/to/socket,pid,session_index
    // Get current session name via tmux display-message
    try {
      currentSession = execFileSync('tmux', ['display-message', '-p', '#S'], {
        encoding: 'utf-8',
        timeout: 5000,
      }).trim();
    } catch {
      // Fall back to parsing TMUX env var
      currentSession = undefined;
    }
  }

  let tmuxAvailable = false;
  let tmuxVersion: string | undefined;

  try {
    const versionOutput = execFileSync('tmux', ['-V'], {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();
    tmuxAvailable = true;
    // Format: "tmux 3.4" or "tmux next-3.5"
    tmuxVersion = versionOutput.replace(/^tmux\s+/, '');
  } catch {
    tmuxAvailable = false;
  }

  return {
    tmuxAvailable,
    isInsideTmux,
    currentSession,
    tmuxVersion,
  };
}
