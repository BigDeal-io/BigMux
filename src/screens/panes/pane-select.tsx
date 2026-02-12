import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select } from '@inkjs/ui';
import { CommandPreview } from '../../components/command-preview.js';
import { useTmux } from '../../hooks/use-tmux.js';
import { buildSelectPane, formatCommandForDisplay } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface PaneSelectProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

export function PaneSelect({ onBack, env }: PaneSelectProps) {
  const { panes, refreshPanes, loading, error } = useTmux();
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<CommandResult | null>(null);

  useEffect(() => { refreshPanes(); }, [refreshPanes]);

  useInput((_input, key) => {
    if (key.escape) {
      if (selected) { setSelected(null); setResult(null); }
      else onBack();
    }
  });

  if (loading) return <Text color={COLORS.muted}>Loading panes...</Text>;
  if (error) return <Text color={COLORS.error}>Error: {error}</Text>;

  if (panes.length === 0) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color={COLORS.muted}>No panes found.</Text>
        <Text color={COLORS.muted}>Press Esc to go back</Text>
      </Box>
    );
  }

  if (selected) {
    const args = buildSelectPane(selected);
    return (
      <CommandPreview
        command={formatCommandForDisplay(args)}
        onExecute={() => {
          const res = executeTmuxCommand(args);
          addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
          setResult(res);
        }}
        onCancel={() => { setSelected(null); setResult(null); }}
        result={result}
      />
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Select Pane</Text>
      <Select
        options={panes.map(p => ({
          label: `Pane ${p.index}${p.active ? ' (active)' : ''} - ${p.width}x${p.height} [${p.command}]`,
          value: `${p.index}`,
        }))}
        onChange={setSelected}
      />
    </Box>
  );
}
