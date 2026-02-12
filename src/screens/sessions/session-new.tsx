import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { TextInput } from '@inkjs/ui';
import { CommandPreview } from '../../components/command-preview.js';
import { useCommandPreview } from '../../hooks/use-command-preview.js';
import { buildNewSession } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { isValidSessionName } from '../../utils/validate.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface SessionNewProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

export function SessionNew({ onBack, env }: SessionNewProps) {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [result, setResult] = useState<CommandResult | null>(null);

  const validationError = name ? isValidSessionName(name) : null;

  const commandBuilder = useCallback(
    () => buildNewSession(name || undefined),
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
    if (!isValidSessionName(value)) {
      setStep('preview');
    }
  }

  function handleExecute() {
    const args = buildNewSession(name || undefined);
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
      <Text bold color={COLORS.accent}>New Session</Text>
      <Box>
        <Text color={COLORS.text}>Session name (optional): </Text>
        <TextInput
          placeholder="my-session"
          onSubmit={handleSubmit}
        />
      </Box>
      {validationError && <Text color={COLORS.error}>{validationError}</Text>}
      <Text color={COLORS.muted}>Press Enter to continue, Esc to go back</Text>
    </Box>
  );
}
