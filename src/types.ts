export type Screen =
  | { type: 'main-menu' }
  | { type: 'session-menu' }
  | { type: 'session-new' }
  | { type: 'session-list' }
  | { type: 'session-attach' }
  | { type: 'window-menu' }
  | { type: 'window-new' }
  | { type: 'window-list' }
  | { type: 'window-rename' }
  | { type: 'window-move' }
  | { type: 'pane-menu' }
  | { type: 'pane-split' }
  | { type: 'pane-select' }
  | { type: 'pane-resize' }
  | { type: 'pane-swap' }
  | { type: 'command-history' }
  | { type: 'help' };

export interface TmuxSession {
  name: string;
  id: string;
  windows: number;
  created: string;
  attached: boolean;
}

export interface TmuxWindow {
  index: number;
  name: string;
  active: boolean;
  panes: number;
  layout: string;
  sessionName: string;
}

export interface TmuxPane {
  index: number;
  active: boolean;
  width: number;
  height: number;
  command: string;
  sessionName: string;
  windowIndex: number;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface TmuxEnvironment {
  tmuxAvailable: boolean;
  isInsideTmux: boolean;
  currentSession?: string;
  tmuxVersion?: string;
}

export interface HistoryEntry {
  command: string;
  args: string[];
  timestamp: number;
  exitCode: number;
}

export const SCREEN_LABELS: Record<Screen['type'], string> = {
  'main-menu': 'Main Menu',
  'session-menu': 'Sessions',
  'session-new': 'New Session',
  'session-list': 'List Sessions',
  'session-attach': 'Attach Session',
  'window-menu': 'Windows',
  'window-new': 'New Window',
  'window-list': 'List Windows',
  'window-rename': 'Rename Window',
  'window-move': 'Move Window',
  'pane-menu': 'Panes',
  'pane-split': 'Split Pane',
  'pane-select': 'Select Pane',
  'pane-resize': 'Resize Pane',
  'pane-swap': 'Swap Pane',
  'command-history': 'Command History',
  'help': 'Help',
};
