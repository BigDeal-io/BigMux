import { describe, it, expect } from 'vitest';
import {
  buildNewSession,
  buildListSessions,
  buildAttachSession,
  buildKillSession,
  buildRenameSession,
  buildNewWindow,
  buildListWindows,
  buildRenameWindow,
  buildSelectWindow,
  buildKillWindow,
  buildMoveWindow,
  buildSwapWindow,
  buildSplitPane,
  buildListPanes,
  buildSelectPane,
  buildResizePane,
  buildKillPane,
  buildSwapPane,
  buildSelectLayout,
  parseSessions,
  parseWindows,
  parsePanes,
  formatCommandForDisplay,
} from '../../src/core/tmux.js';

describe('Session command builders', () => {
  it('builds new-session with no args', () => {
    expect(buildNewSession()).toEqual(['new-session', '-d']);
  });

  it('builds new-session with name', () => {
    expect(buildNewSession('dev')).toEqual(['new-session', '-d', '-s', 'dev']);
  });

  it('builds new-session with name and dir', () => {
    expect(buildNewSession('dev', '/tmp')).toEqual(['new-session', '-d', '-s', 'dev', '-c', '/tmp']);
  });

  it('builds list-sessions', () => {
    const args = buildListSessions();
    expect(args[0]).toBe('list-sessions');
    expect(args[1]).toBe('-F');
  });

  it('builds attach-session outside tmux', () => {
    expect(buildAttachSession('dev', false)).toEqual(['attach-session', '-t', 'dev']);
  });

  it('builds switch-client inside tmux', () => {
    expect(buildAttachSession('dev', true)).toEqual(['switch-client', '-t', 'dev']);
  });

  it('builds kill-session', () => {
    expect(buildKillSession('dev')).toEqual(['kill-session', '-t', 'dev']);
  });

  it('builds rename-session', () => {
    expect(buildRenameSession('old', 'new')).toEqual(['rename-session', '-t', 'old', 'new']);
  });
});

describe('Window command builders', () => {
  it('builds new-window with no args', () => {
    expect(buildNewWindow()).toEqual(['new-window']);
  });

  it('builds new-window with name', () => {
    expect(buildNewWindow('editor')).toEqual(['new-window', '-n', 'editor']);
  });

  it('builds list-windows', () => {
    const args = buildListWindows();
    expect(args[0]).toBe('list-windows');
  });

  it('builds list-windows for a session', () => {
    const args = buildListWindows('dev');
    expect(args).toContain('-t');
    expect(args).toContain('dev');
  });

  it('builds rename-window', () => {
    expect(buildRenameWindow('dev:0', 'main')).toEqual(['rename-window', '-t', 'dev:0', 'main']);
  });

  it('builds select-window', () => {
    expect(buildSelectWindow('dev:1')).toEqual(['select-window', '-t', 'dev:1']);
  });

  it('builds kill-window', () => {
    expect(buildKillWindow('dev:0')).toEqual(['kill-window', '-t', 'dev:0']);
  });

  it('builds move-window', () => {
    expect(buildMoveWindow('dev:0', 'dev:5')).toEqual(['move-window', '-s', 'dev:0', '-t', 'dev:5']);
  });

  it('builds swap-window', () => {
    expect(buildSwapWindow('dev:0', 'dev:1')).toEqual(['swap-window', '-s', 'dev:0', '-t', 'dev:1']);
  });
});

describe('Pane command builders', () => {
  it('builds split-pane horizontal', () => {
    expect(buildSplitPane('horizontal')).toEqual(['split-window', '-h']);
  });

  it('builds split-pane vertical', () => {
    expect(buildSplitPane('vertical')).toEqual(['split-window', '-v']);
  });

  it('builds split-pane with percentage', () => {
    expect(buildSplitPane('horizontal', 30)).toEqual(['split-window', '-h', '-p', '30']);
  });

  it('builds select-pane', () => {
    expect(buildSelectPane('2')).toEqual(['select-pane', '-t', '2']);
  });

  it('builds resize-pane', () => {
    expect(buildResizePane('U', 10)).toEqual(['resize-pane', '-U', '10']);
  });

  it('builds resize-pane with target', () => {
    expect(buildResizePane('L', 5, '1')).toEqual(['resize-pane', '-L', '5', '-t', '1']);
  });

  it('builds kill-pane', () => {
    expect(buildKillPane()).toEqual(['kill-pane']);
  });

  it('builds kill-pane with target', () => {
    expect(buildKillPane('2')).toEqual(['kill-pane', '-t', '2']);
  });

  it('builds swap-pane', () => {
    expect(buildSwapPane('0', '1')).toEqual(['swap-pane', '-s', '0', '-t', '1']);
  });

  it('builds select-layout', () => {
    expect(buildSelectLayout('tiled')).toEqual(['select-layout', 'tiled']);
  });

  it('builds select-layout with target', () => {
    expect(buildSelectLayout('even-horizontal', 'dev:0')).toEqual(['select-layout', 'even-horizontal', '-t', 'dev:0']);
  });
});

describe('Output parsers', () => {
  it('parses sessions', () => {
    const output = 'dev|$0|3|1700000000|1\ntest|$1|1|1700000001|0\n';
    const sessions = parseSessions(output);
    expect(sessions).toHaveLength(2);
    expect(sessions[0]).toEqual({
      name: 'dev',
      id: '$0',
      windows: 3,
      created: '1700000000',
      attached: true,
    });
    expect(sessions[1]?.attached).toBe(false);
  });

  it('parses empty session output', () => {
    expect(parseSessions('')).toEqual([]);
    expect(parseSessions('  \n')).toEqual([]);
  });

  it('parses windows', () => {
    const output = '0|bash|1|2|layout|dev\n1|vim|0|1|layout|dev\n';
    const windows = parseWindows(output);
    expect(windows).toHaveLength(2);
    expect(windows[0]).toEqual({
      index: 0,
      name: 'bash',
      active: true,
      panes: 2,
      layout: 'layout',
      sessionName: 'dev',
    });
  });

  it('parses panes', () => {
    const output = '0|1|80|24|bash|dev|0\n1|0|80|24|vim|dev|0\n';
    const panes = parsePanes(output);
    expect(panes).toHaveLength(2);
    expect(panes[0]).toEqual({
      index: 0,
      active: true,
      width: 80,
      height: 24,
      command: 'bash',
      sessionName: 'dev',
      windowIndex: 0,
    });
  });
});

describe('formatCommandForDisplay', () => {
  it('formats simple args', () => {
    expect(formatCommandForDisplay(['new-session', '-d', '-s', 'dev'])).toBe('tmux new-session -d -s dev');
  });

  it('quotes args with spaces', () => {
    expect(formatCommandForDisplay(['new-session', '-c', '/my path'])).toBe('tmux new-session -c "/my path"');
  });
});
