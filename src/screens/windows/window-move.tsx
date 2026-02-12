import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select, TextInput } from '@inkjs/ui';
import { CommandPreview } from '../../components/command-preview.js';
import { useCommandPreview } from '../../hooks/use-command-preview.js';
import { useTmux } from '../../hooks/use-tmux.js';
import { buildMoveWindow, buildSwapWindow } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface WindowMoveProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

type MoveStep = 'mode' | 'source' | 'dest' | 'preview';

export function WindowMove({ onBack, env }: WindowMoveProps) {
  const { windows, refreshWindows, loading } = useTmux();
  const [mode, setMode] = useState<'move' | 'swap'>('move');
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [step, setStep] = useState<MoveStep>('mode');
  const [result, setResult] = useState<CommandResult | null>(null);

  useEffect(() => { refreshWindows(); }, [refreshWindows]);

  const commandBuilder = useCallback(
    () => {
      if (!source || !dest) return null;
      return mode === 'move' ? buildMoveWindow(source, dest) : buildSwapWindow(source, dest);
    },
    [source, dest, mode],
  );
  const command = useCommandPreview(commandBuilder);

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'mode') onBack();
      else if (step === 'source') setStep('mode');
      else if (step === 'dest') { setStep('source'); setSource(''); }
      else { setStep('dest'); setDest(''); setResult(null); }
    }
  });

  if (loading) return <Text color={COLORS.muted}>Loading windows...</Text>;

  if (windows.length < 2) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color={COLORS.muted}>Need at least 2 windows to move/swap.</Text>
        <Text color={COLORS.muted}>Press Esc to go back</Text>
      </Box>
    );
  }

  if (step === 'preview' && command) {
    return (
      <CommandPreview
        command={command}
        onExecute={() => {
          const args = mode === 'move' ? buildMoveWindow(source, dest) : buildSwapWindow(source, dest);
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
        <Text bold color={COLORS.accent}>Select destination window:</Text>
        <Select
          options={windows
            .filter(w => `${w.sessionName}:${w.index}` !== source)
            .map(w => ({
              label: `${w.index}: ${w.name}`,
              value: `${w.sessionName}:${w.index}`,
            }))}
          onChange={(value) => { setDest(value); setStep('preview'); }}
        />
      </Box>
    );
  }

  if (step === 'source') {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Select source window ({mode}):</Text>
        <Select
          options={windows.map(w => ({
            label: `${w.index}: ${w.name}`,
            value: `${w.sessionName}:${w.index}`,
          }))}
          onChange={(value) => { setSource(value); setStep('dest'); }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Window Move / Swap</Text>
      <Select
        options={[
          { label: 'Move window', value: 'move' },
          { label: 'Swap windows', value: 'swap' },
        ]}
        onChange={(value) => { setMode(value as 'move' | 'swap'); setStep('source'); }}
      />
    </Box>
  );
}
