import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select, TextInput } from '@inkjs/ui';
import { CommandPreview } from '../../components/command-preview.js';
import { useCommandPreview } from '../../hooks/use-command-preview.js';
import { useTmux } from '../../hooks/use-tmux.js';
import { buildRenameWindow } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { isValidWindowName } from '../../utils/validate.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface WindowRenameProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

type RenameStep = 'select' | 'name' | 'preview';

export function WindowRename({ onBack, env }: WindowRenameProps) {
  const { windows, refreshWindows, loading } = useTmux();
  const [target, setTarget] = useState('');
  const [newName, setNewName] = useState('');
  const [step, setStep] = useState<RenameStep>('select');
  const [result, setResult] = useState<CommandResult | null>(null);

  useEffect(() => { refreshWindows(); }, [refreshWindows]);

  const commandBuilder = useCallback(
    () => (target && newName) ? buildRenameWindow(target, newName) : null,
    [target, newName],
  );
  const command = useCommandPreview(commandBuilder);

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'select') onBack();
      else if (step === 'name') { setStep('select'); setTarget(''); }
      else { setStep('name'); setResult(null); }
    }
  });

  if (loading) return <Text color={COLORS.muted}>Loading windows...</Text>;

  if (windows.length === 0) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color={COLORS.muted}>No windows found.</Text>
        <Text color={COLORS.muted}>Press Esc to go back</Text>
      </Box>
    );
  }

  if (step === 'preview' && command) {
    return (
      <CommandPreview
        command={command}
        onExecute={() => {
          const args = buildRenameWindow(target, newName);
          const res = executeTmuxCommand(args);
          addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
          setResult(res);
        }}
        onCancel={onBack}
        result={result}
      />
    );
  }

  if (step === 'name') {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Rename Window: {target}</Text>
        <Box>
          <Text color={COLORS.text}>New name: </Text>
          <TextInput
            placeholder="new-name"
            onSubmit={(value) => {
              const err = isValidWindowName(value);
              if (!err) {
                setNewName(value);
                setStep('preview');
              }
            }}
          />
        </Box>
        <Text color={COLORS.muted}>Press Enter to continue, Esc to go back</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Select window to rename:</Text>
      <Select
        options={windows.map(w => ({
          label: `${w.index}: ${w.name}`,
          value: `${w.sessionName}:${w.index}`,
        }))}
        onChange={(value) => { setTarget(value); setStep('name'); }}
      />
    </Box>
  );
}
