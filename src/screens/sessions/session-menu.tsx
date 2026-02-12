import React from 'react';
import { useInput } from 'ink';
import { Menu } from '../../components/menu.js';
import type { Screen } from '../../types.js';

interface SessionMenuProps {
  onSelect: (screen: Screen) => void;
  onBack: () => void;
}

export function SessionMenu({ onSelect, onBack }: SessionMenuProps) {
  useInput((_input, key) => {
    if (key.escape) onBack();
  });

  const items = [
    { label: 'New Session', value: 'session-new', description: 'Create a new tmux session' },
    { label: 'List Sessions', value: 'session-list', description: 'View and manage sessions' },
    { label: 'Attach Session', value: 'session-attach', description: 'Attach to an existing session' },
  ];

  function handleSelect(value: string) {
    onSelect({ type: value } as Screen);
  }

  return <Menu items={items} onSelect={handleSelect} onBack={onBack} title="Session Management" />;
}
