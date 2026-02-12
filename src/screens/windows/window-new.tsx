import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { TextInput } from '@inkjs/ui';
import { CommandPreview } from '../../components/command-preview.js';
import { useCommandPreview } from '../../hooks/use-command-preview.js';
import { buildNewWindow } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { isValidWindowName } from '../../utils/validate.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface WindowNewProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

export function WindowNew({ onBack, env }: WindowNewProps) {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [result, setResult] = useState<CommandResult | null>(null);

  const commandBuilder = useCallback(
    () => buildNewWindow(name || undefined),
    [name],
  );
  const command = useCommandPreview(commandBuilder);

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'preview') {
        setStep('input');
        setResult(null);
      } else {
        onBack();
      }
    }
  });

  function handleSubmit(value: string) {
    setName(value);
    setStep('preview');
  }

  function handleExecute() {
    const args = buildNewWindow(name || undefined);
    const res = executeTmuxCommand(args);
    addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
    setResult(res);
  }

  if (step === 'preview') {
    return (
      <CommandPreview
        command={command}
        onExecute={handleExecute}
        onCancel={onBack}
        result={result}
      />
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>New Window</Text>
      <Box>
        <Text color={COLORS.text}>Window name (optional): </Text>
        <TextInput placeholder="my-window" onSubmit={handleSubmit} />
      </Box>
      <Text color={COLORS.muted}>Press Enter to continue, Esc to go back</Text>
    </Box>
  );
}
