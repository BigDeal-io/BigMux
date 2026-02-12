import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select, TextInput } from '@inkjs/ui';
import { CommandPreview } from '../../components/command-preview.js';
import { useCommandPreview } from '../../hooks/use-command-preview.js';
import { buildResizePane, buildSelectLayout } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface PaneResizeProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

type ResizeStep = 'mode' | 'direction' | 'amount' | 'layout' | 'preview';

export function PaneResize({ onBack, env }: PaneResizeProps) {
  const [mode, setMode] = useState<'resize' | 'layout'>('resize');
  const [direction, setDirection] = useState<'U' | 'D' | 'L' | 'R'>('U');
  const [amount, setAmount] = useState(5);
  const [layout, setLayout] = useState('even-horizontal');
  const [step, setStep] = useState<ResizeStep>('mode');
  const [result, setResult] = useState<CommandResult | null>(null);

  const commandBuilder = useCallback(() => {
    if (mode === 'layout') return buildSelectLayout(layout);
    return buildResizePane(direction, amount);
  }, [mode, direction, amount, layout]);
  const command = useCommandPreview(commandBuilder);

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'mode') onBack();
      else if (step === 'direction' || step === 'layout') setStep('mode');
      else if (step === 'amount') setStep('direction');
      else { setStep(mode === 'layout' ? 'layout' : 'amount'); setResult(null); }
    }
  });

  if (step === 'preview') {
    return (
      <CommandPreview
        command={command}
        onExecute={() => {
          const args = mode === 'layout' ? buildSelectLayout(layout) : buildResizePane(direction, amount);
          const res = executeTmuxCommand(args);
          addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
          setResult(res);
        }}
        onCancel={onBack}
        result={result}
      />
    );
  }

  if (step === 'layout') {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Select Layout</Text>
        <Select
          options={[
            { label: 'Even Horizontal', value: 'even-horizontal' },
            { label: 'Even Vertical', value: 'even-vertical' },
            { label: 'Main Horizontal', value: 'main-horizontal' },
            { label: 'Main Vertical', value: 'main-vertical' },
            { label: 'Tiled', value: 'tiled' },
          ]}
          onChange={(value) => { setLayout(value); setStep('preview'); }}
        />
      </Box>
    );
  }

  if (step === 'amount') {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Resize Amount (cells)</Text>
        <Box>
          <Text color={COLORS.text}>Amount (default 5): </Text>
          <TextInput
            placeholder="5"
            onSubmit={(value) => {
              const n = parseInt(value || '5', 10);
              if (n >= 1 && n <= 100) setAmount(n);
              setStep('preview');
            }}
          />
        </Box>
      </Box>
    );
  }

  if (step === 'direction') {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Resize Direction</Text>
        <Select
          options={[
            { label: 'Up', value: 'U' },
            { label: 'Down', value: 'D' },
            { label: 'Left', value: 'L' },
            { label: 'Right', value: 'R' },
          ]}
          onChange={(value) => { setDirection(value as 'U' | 'D' | 'L' | 'R'); setStep('amount'); }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Pane Resize / Layout</Text>
      <Select
        options={[
          { label: 'Resize pane', value: 'resize' },
          { label: 'Apply layout preset', value: 'layout' },
        ]}
        onChange={(value) => {
          setMode(value as 'resize' | 'layout');
          setStep(value === 'layout' ? 'layout' : 'direction');
        }}
      />
    </Box>
  );
}
