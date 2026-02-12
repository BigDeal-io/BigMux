import React from 'react';
import { useInput } from 'ink';
import { Menu } from '../../components/menu.js';
import type { Screen } from '../../types.js';

interface WindowMenuProps {
  onSelect: (screen: Screen) => void;
  onBack: () => void;
}

export function WindowMenu({ onSelect, onBack }: WindowMenuProps) {
  useInput((_input, key) => {
    if (key.escape) onBack();
  });

  const items = [
    { label: 'New Window', value: 'window-new', description: 'Create a new window' },
    { label: 'List Windows', value: 'window-list', description: 'View and manage windows' },
    { label: 'Rename Window', value: 'window-rename', description: 'Rename a window' },
    { label: 'Move / Swap Window', value: 'window-move', description: 'Move or swap windows' },
  ];

  return (
    <Menu
      items={items}
      onSelect={(value) => onSelect({ type: value } as Screen)}
      onBack={onBack}
      title="Window Management"
    />
  );
}
