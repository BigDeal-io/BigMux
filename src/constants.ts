import { homedir } from 'os';
import { join } from 'path';

export const BIGMUX_DIR = join(homedir(), '.bigmux');
export const HISTORY_FILE = join(BIGMUX_DIR, 'history.json');
export const MAX_HISTORY_ENTRIES = 500;

export const COLORS = {
  primary: '#61AFEF',
  secondary: '#98C379',
  accent: '#E5C07B',
  error: '#E06C75',
  muted: '#5C6370',
  text: '#ABB2BF',
  border: '#3E4451',
  success: '#98C379',
  warning: '#E5C07B',
} as const;

export const KEYS = {
  QUIT: 'q',
  BACK: 'escape',
  HELP: '?',
  CONFIRM: 'return',
} as const;

export const KEY_LABELS = {
  navigate: '\u2191\u2193 Navigate',
  select: '\u21B5 Select',
  back: 'Esc Back',
  quit: 'q Quit',
  help: '? Help',
  confirm: '\u21B5 Confirm',
  cancel: 'Esc Cancel',
  copy: 'c Copy',
  execute: 'x Execute',
  delete: 'd Delete',
} as const;

export const APP_NAME = 'bigmux';
export const APP_VERSION = '0.1.0';
export const APP_TAGLINE = 'tmux, the easy way';
export const APP_AUTHOR = 'Fractional CTO Solutions';
export const APP_AUTHOR_URL = 'https://fractionalctosolutions.com';
export const APP_COMPANY = 'BIGDEALIO, LLC';

export const APP_LOGO = [
  '█▀▄ █ █▀▀ █▄ ▄█ █  █ ▀▄▀',
  '█▀▄ █ █▄█ █ ▀ █ █  █  █',
  '▀▀  ▀ ▀▀▀ ▀   ▀  ▀▀  ▀ ▀',
];
