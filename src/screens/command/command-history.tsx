import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select } from '@inkjs/ui';
import { readHistory, deleteHistoryEntry } from '../../core/history.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { useClipboard } from '../../hooks/use-clipboard.js';
import { CommandPreview } from '../../components/command-preview.js';
import { ConfirmDialog } from '../../components/confirm-dialog.js';
import { formatCommandForDisplay } from '../../core/tmux.js';
import { timeAgo } from '../../utils/format.js';
import { COLORS } from '../../constants.js';
import type { HistoryEntry, CommandResult } from '../../types.js';

interface CommandHistoryProps {
  onBack: () => void;
}

type HistoryStep = 'list' | 'actions' | 'preview' | 'confirm-delete';

export function CommandHistory({ onBack }: CommandHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [step, setStep] = useState<HistoryStep>('list');
  const [result, setResult] = useState<CommandResult | null>(null);
  const { copied, copyToClipboard } = useClipboard();

  useEffect(() => {
    setEntries(readHistory().reverse());
  }, []);

  function refresh() {
    setEntries(readHistory().reverse());
    setSelectedIndex(null);
    setStep('list');
    setResult(null);
  }

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'list') onBack();
      else refresh();
    }
  });

  if (entries.length === 0) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Command History</Text>
        <Text color={COLORS.muted}>No commands in history yet.</Text>
        <Text color={COLORS.muted}>Commands will appear here after you execute them.</Text>
        <Text color={COLORS.muted}>Press Esc to go back</Text>
      </Box>
    );
  }

  const selected = selectedIndex !== null ? entries[selectedIndex] : null;

  if (step === 'confirm-delete' && selectedIndex !== null) {
    const realIndex = entries.length - 1 - selectedIndex;
    return (
      <ConfirmDialog
        message="Delete this history entry?"
        onConfirm={() => {
          deleteHistoryEntry(realIndex);
          refresh();
        }}
        onCancel={() => setStep('actions')}
      />
    );
  }

  if (step === 'preview' && selected) {
    const cmd = formatCommandForDisplay(selected.args);
    return (
      <CommandPreview
        command={cmd}
        onExecute={() => {
          const res = executeTmuxCommand(selected.args);
          addHistoryEntry({ command: 'tmux', args: selected.args, timestamp: Date.now(), exitCode: res.exitCode });
          setResult(res);
        }}
        onCancel={refresh}
        result={result}
      />
    );
  }

  if (step === 'actions' && selected) {
    const cmd = formatCommandForDisplay(selected.args);
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>{cmd}</Text>
        <Text color={COLORS.muted}>{timeAgo(selected.timestamp)} - exit code {selected.exitCode}</Text>
        <Select
          options={[
            { label: 'Re-execute', value: 'execute' },
            { label: 'Copy to clipboard', value: 'copy' },
            { label: 'Delete entry', value: 'delete' },
          ]}
          onChange={(value) => {
            if (value === 'execute') setStep('preview');
            else if (value === 'copy') {
              copyToClipboard(cmd);
            }
            else if (value === 'delete') setStep('confirm-delete');
          }}
        />
        {copied && <Text color={COLORS.success}>Copied!</Text>}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Command History ({entries.length})</Text>
      <Select
        options={entries.map((e, i) => ({
          label: `${formatCommandForDisplay(e.args)} (${timeAgo(e.timestamp)})`,
          value: String(i),
        }))}
        onChange={(value) => {
          setSelectedIndex(parseInt(value, 10));
          setStep('actions');
        }}
      />
    </Box>
  );
}
