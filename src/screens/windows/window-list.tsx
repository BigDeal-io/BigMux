import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select } from '@inkjs/ui';
import { useTmux } from '../../hooks/use-tmux.js';
import { ConfirmDialog } from '../../components/confirm-dialog.js';
import { CommandPreview } from '../../components/command-preview.js';
import { buildKillWindow, buildSelectWindow, formatCommandForDisplay } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { COLORS } from '../../constants.js';
import type { Screen, TmuxEnvironment, CommandResult } from '../../types.js';

interface WindowListProps {
  onSelect: (screen: Screen) => void;
  onBack: () => void;
  env: TmuxEnvironment;
}

type ListStep = 'list' | 'actions' | 'confirm-kill' | 'preview';

export function WindowList({ onSelect, onBack, env }: WindowListProps) {
  const { windows, refreshWindows, loading, error } = useTmux();
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
  const [step, setStep] = useState<ListStep>('list');
  const [pendingArgs, setPendingArgs] = useState<string[] | null>(null);
  const [result, setResult] = useState<CommandResult | null>(null);

  useEffect(() => {
    refreshWindows();
  }, [refreshWindows]);

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'list') onBack();
      else {
        setStep('list');
        setSelectedWindow(null);
        setResult(null);
        setPendingArgs(null);
        refreshWindows();
      }
    }
  });

  if (loading) return <Text color={COLORS.muted}>Loading windows...</Text>;
  if (error) return <Text color={COLORS.error}>Error: {error}</Text>;

  if (windows.length === 0) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color={COLORS.muted}>No windows found.</Text>
        <Text color={COLORS.muted}>Press Esc to go back</Text>
      </Box>
    );
  }

  if (step === 'confirm-kill' && selectedWindow) {
    return (
      <ConfirmDialog
        message={`Kill window "${selectedWindow}"? This will close all panes.`}
        onConfirm={() => {
          const args = buildKillWindow(selectedWindow);
          setPendingArgs(args);
          setStep('preview');
        }}
        onCancel={() => { setStep('list'); setSelectedWindow(null); }}
      />
    );
  }

  if (step === 'preview' && pendingArgs) {
    return (
      <CommandPreview
        command={formatCommandForDisplay(pendingArgs)}
        onExecute={() => {
          const res = executeTmuxCommand(pendingArgs);
          addHistoryEntry({ command: 'tmux', args: pendingArgs, timestamp: Date.now(), exitCode: res.exitCode });
          setResult(res);
        }}
        onCancel={() => { setStep('list'); setSelectedWindow(null); setPendingArgs(null); refreshWindows(); }}
        result={result}
      />
    );
  }

  if (step === 'actions' && selectedWindow) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Window: {selectedWindow}</Text>
        <Select
          options={[
            { label: 'Select (switch to)', value: 'select' },
            { label: 'Rename', value: 'rename' },
            { label: 'Kill window', value: 'kill' },
          ]}
          onChange={(value) => {
            if (value === 'select') {
              const args = buildSelectWindow(selectedWindow);
              setPendingArgs(args);
              setStep('preview');
            } else if (value === 'rename') {
              onSelect({ type: 'window-rename' });
            } else if (value === 'kill') {
              setStep('confirm-kill');
            }
          }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Windows ({windows.length})</Text>
      <Select
        options={windows.map(w => ({
          label: `${w.index}: ${w.name}${w.active ? ' (active)' : ''} - ${w.panes} pane${w.panes !== 1 ? 's' : ''}`,
          value: `${w.sessionName}:${w.index}`,
        }))}
        onChange={(value) => {
          setSelectedWindow(value);
          setStep('actions');
        }}
      />
    </Box>
  );
}
