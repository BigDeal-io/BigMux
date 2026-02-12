import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select, TextInput } from '@inkjs/ui';
import { CommandPreview } from '../../components/command-preview.js';
import { useCommandPreview } from '../../hooks/use-command-preview.js';
import { buildSplitPane } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface PaneSplitProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

type SplitStep = 'direction' | 'percentage' | 'preview';

export function PaneSplit({ onBack, env }: PaneSplitProps) {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [percentage, setPercentage] = useState<number | undefined>(undefined);
  const [step, setStep] = useState<SplitStep>('direction');
  const [result, setResult] = useState<CommandResult | null>(null);

  const commandBuilder = useCallback(
    () => buildSplitPane(direction, percentage),
    [direction, percentage],
  );
  const command = useCommandPreview(commandBuilder);

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'direction') onBack();
      else if (step === 'percentage') setStep('direction');
      else { setStep('percentage'); setResult(null); }
    }
  });

  if (step === 'preview') {
    return (
      <CommandPreview
        command={command}
        onExecute={() => {
          const args = buildSplitPane(direction, percentage);
          const res = executeTmuxCommand(args);
          addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
          setResult(res);
        }}
        onCancel={onBack}
        result={result}
      />
    );
  }

  if (step === 'percentage') {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>
          Split {direction === 'horizontal' ? 'Horizontal (\u2502)' : 'Vertical (\u2500)'}
        </Text>
        <Box>
          <Text color={COLORS.text}>Size % (optional, press Enter to skip): </Text>
          <TextInput
            placeholder="50"
            onSubmit={(value) => {
              if (value.trim()) {
                const pct = parseInt(value, 10);
                if (pct >= 1 && pct <= 99) setPercentage(pct);
              }
              setStep('preview');
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Split Direction</Text>
      <Select
        options={[
          { label: 'Horizontal (\u2502) - side by side', value: 'horizontal' },
          { label: 'Vertical (\u2500) - top and bottom', value: 'vertical' },
        ]}
        onChange={(value) => {
          setDirection(value as 'horizontal' | 'vertical');
          setStep('percentage');
        }}
      />
    </Box>
  );
}
