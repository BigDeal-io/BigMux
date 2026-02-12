import type { TmuxSession, TmuxWindow, TmuxPane } from '../types.js';

// ── Session command builders ───────────────────────────────────────────

export function buildNewSession(name?: string, startDir?: string): string[] {
  const args = ['new-session', '-d'];
  if (name) args.push('-s', name);
  if (startDir) args.push('-c', startDir);
  return args;
}

export function buildListSessions(): string[] {
  return ['list-sessions', '-F', '#{session_name}|#{session_id}|#{session_windows}|#{session_created}|#{session_attached}'];
}

export function buildAttachSession(target: string, isInsideTmux: boolean): string[] {
  if (isInsideTmux) {
    return ['switch-client', '-t', target];
  }
  return ['attach-session', '-t', target];
}

export function buildKillSession(target: string): string[] {
  return ['kill-session', '-t', target];
}

export function buildRenameSession(target: string, newName: string): string[] {
  return ['rename-session', '-t', target, newName];
}

// ── Window command builders ────────────────────────────────────────────

export function buildNewWindow(name?: string, target?: string): string[] {
  const args = ['new-window'];
  if (name) args.push('-n', name);
  if (target) args.push('-t', target);
  return args;
}

export function buildListWindows(session?: string): string[] {
  const args = ['list-windows', '-F', '#{window_index}|#{window_name}|#{window_active}|#{window_panes}|#{window_layout}|#{session_name}'];
  if (session) args.push('-t', session);
  return args;
}

export function buildRenameWindow(target: string, newName: string): string[] {
  return ['rename-window', '-t', target, newName];
}

export function buildSelectWindow(target: string): string[] {
  return ['select-window', '-t', target];
}

export function buildKillWindow(target: string): string[] {
  return ['kill-window', '-t', target];
}

export function buildMoveWindow(src: string, dst: string): string[] {
  return ['move-window', '-s', src, '-t', dst];
}

export function buildSwapWindow(src: string, dst: string): string[] {
  return ['swap-window', '-s', src, '-t', dst];
}

// ── Pane command builders ──────────────────────────────────────────────

export function buildSplitPane(direction: 'horizontal' | 'vertical', percentage?: number, target?: string): string[] {
  const args = ['split-window'];
  args.push(direction === 'horizontal' ? '-h' : '-v');
  if (percentage) args.push('-p', String(percentage));
  if (target) args.push('-t', target);
  return args;
}

export function buildListPanes(target?: string): string[] {
  const args = ['list-panes', '-F', '#{pane_index}|#{pane_active}|#{pane_width}|#{pane_height}|#{pane_current_command}|#{session_name}|#{window_index}'];
  if (target) args.push('-t', target);
  return args;
}

export function buildSelectPane(target: string): string[] {
  return ['select-pane', '-t', target];
}

export function buildResizePane(direction: 'U' | 'D' | 'L' | 'R', amount: number, target?: string): string[] {
  const args = ['resize-pane', `-${direction}`, String(amount)];
  if (target) args.push('-t', target);
  return args;
}

export function buildKillPane(target?: string): string[] {
  const args = ['kill-pane'];
  if (target) args.push('-t', target);
  return args;
}

export function buildSwapPane(src: string, dst: string): string[] {
  return ['swap-pane', '-s', src, '-t', dst];
}

export function buildSelectLayout(layout: string, target?: string): string[] {
  const args = ['select-layout', layout];
  if (target) args.push('-t', target);
  return args;
}

// ── Output parsers ─────────────────────────────────────────────────────

export function parseSessions(output: string): TmuxSession[] {
  if (!output.trim()) return [];
  return output.trim().split('\n').map(line => {
    const [name, id, windows, created, attached] = line.split('|');
    return {
      name: name ?? '',
      id: id ?? '',
      windows: parseInt(windows ?? '0', 10),
      created: created ?? '',
      attached: attached === '1',
    };
  });
}

export function parseWindows(output: string): TmuxWindow[] {
  if (!output.trim()) return [];
  return output.trim().split('\n').map(line => {
    const [index, name, active, panes, layout, sessionName] = line.split('|');
    return {
      index: parseInt(index ?? '0', 10),
      name: name ?? '',
      active: active === '1',
      panes: parseInt(panes ?? '0', 10),
      layout: layout ?? '',
      sessionName: sessionName ?? '',
    };
  });
}

export function parsePanes(output: string): TmuxPane[] {
  if (!output.trim()) return [];
  return output.trim().split('\n').map(line => {
    const [index, active, width, height, command, sessionName, windowIndex] = line.split('|');
    return {
      index: parseInt(index ?? '0', 10),
      active: active === '1',
      width: parseInt(width ?? '0', 10),
      height: parseInt(height ?? '0', 10),
      command: command ?? '',
      sessionName: sessionName ?? '',
      windowIndex: parseInt(windowIndex ?? '0', 10),
    };
  });
}

// ── Helpers ────────────────────────────────────────────────────────────

export function formatCommandForDisplay(args: string[]): string {
  return `tmux ${args.map(a => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`;
}
