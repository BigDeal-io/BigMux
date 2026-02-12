import React from 'react';
import { Menu } from '../components/menu.js';
import type { Screen, TmuxEnvironment } from '../types.js';

interface MainMenuProps {
  onSelect: (screen: Screen) => void;
  env: TmuxEnvironment;
}

export function MainMenu({ onSelect, env }: MainMenuProps) {
  const items = [
    { label: 'Sessions', value: 'session-menu', description: 'Create, list, attach, kill sessions' },
    { label: 'Windows', value: 'window-menu', description: 'Create, list, rename, move windows', disabled: !env.isInsideTmux },
    { label: 'Panes', value: 'pane-menu', description: 'Split, select, resize, swap panes', disabled: !env.isInsideTmux },
    { label: 'Command History', value: 'command-history', description: 'View past commands' },
    { label: 'Help', value: 'help', description: 'Keybindings and tmux concepts' },
  ];

  function handleSelect(value: string) {
    onSelect({ type: value } as Screen);
  }

  return (
    <Menu
      items={items}
      onSelect={handleSelect}
      title="What would you like to do?"
    />
  );
}
