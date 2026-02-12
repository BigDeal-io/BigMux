import React from 'react';
import { useInput } from 'ink';
import { Menu } from '../../components/menu.js';
import type { Screen } from '../../types.js';

interface PaneMenuProps {
  onSelect: (screen: Screen) => void;
  onBack: () => void;
}

export function PaneMenu({ onSelect, onBack }: PaneMenuProps) {
  useInput((_input, key) => {
    if (key.escape) onBack();
  });

  const items = [
    { label: 'Split Pane', value: 'pane-split', description: 'Split horizontally or vertically' },
    { label: 'Select Pane', value: 'pane-select', description: 'Switch to a pane' },
    { label: 'Resize Pane', value: 'pane-resize', description: 'Resize the current pane' },
    { label: 'Swap Panes', value: 'pane-swap', description: 'Swap two panes' },
  ];

  return (
    <Menu
      items={items}
      onSelect={(value) => onSelect({ type: value } as Screen)}
      onBack={onBack}
      title="Pane Management"
    />
  );
}
