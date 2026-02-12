import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select } from '@inkjs/ui';
import { CommandPreview } from '../../components/command-preview.js';
import { useCommandPreview } from '../../hooks/use-command-preview.js';
import { useTmux } from '../../hooks/use-tmux.js';
import { buildSwapPane } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface PaneSwapProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

type SwapStep = 'source' | 'dest' | 'preview';

export function PaneSwap({ onBack, env }: PaneSwapProps) {
  const { panes, refreshPanes, loading, error } = useTmux();
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [step, setStep] = useState<SwapStep>('source');
  const [result, setResult] = useState<CommandResult | null>(null);

  useEffect(() => { refreshPanes(); }, [refreshPanes]);

  const commandBuilder = useCallback(
    () => (source && dest) ? buildSwapPane(source, dest) : null,
    [source, dest],
  );
  const command = useCommandPreview(commandBuilder);

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'source') onBack();
      else if (step === 'dest') { setStep('source'); setSource(''); }
      else { setStep('dest'); setDest(''); setResult(null); }
    }
  });

  if (loading) return <Text color={COLORS.muted}>Loading panes...</Text>;
  if (error) return <Text color={COLORS.error}>Error: {error}</Text>;

  if (panes.length < 2) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color={COLORS.muted}>Need at least 2 panes to swap.</Text>
        <Text color={COLORS.muted}>Press Esc to go back</Text>
      </Box>
    );
  }

  if (step === 'preview' && command) {
    return (
      <CommandPreview
        command={command}
        onExecute={() => {
          const args = buildSwapPane(source, dest);
          const res = executeTmuxCommand(args);
          addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
          setResult(res);
        }}
        onCancel={onBack}
        result={result}
      />
    );
  }

  if (step === 'dest') {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Select destination pane:</Text>
        <Select
          options={panes
            .filter(p => String(p.index) !== source)
            .map(p => ({
              label: `Pane ${p.index}${p.active ? ' (active)' : ''} - ${p.width}x${p.height} [${p.command}]`,
              value: String(p.index),
            }))}
          onChange={(value) => { setDest(value); setStep('preview'); }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Select source pane:</Text>
      <Select
        options={panes.map(p => ({
          label: `Pane ${p.index}${p.active ? ' (active)' : ''} - ${p.width}x${p.height} [${p.command}]`,
          value: String(p.index),
        }))}
        onChange={(value) => { setSource(value); setStep('dest'); }}
      />
    </Box>
  );
}
