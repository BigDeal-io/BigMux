import React, { useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Select } from '@inkjs/ui';
import { useTmux } from '../../hooks/use-tmux.js';
import { CommandPreview } from '../../components/command-preview.js';
import { buildAttachSession, formatCommandForDisplay } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { setPendingAttach } from '../../cli.js';
import { COLORS } from '../../constants.js';
import type { TmuxEnvironment, CommandResult } from '../../types.js';

interface SessionAttachProps {
  onBack: () => void;
  env: TmuxEnvironment;
}

export function SessionAttach({ onBack, env }: SessionAttachProps) {
  const { sessions, loading, error } = useTmux();
  const { exit } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<CommandResult | null>(null);

  useInput((_input, key) => {
    if (key.escape) {
      if (selected) {
        setSelected(null);
        setResult(null);
      } else {
        onBack();
      }
    }
  });

  if (loading) return <Text color={COLORS.muted}>Loading sessions...</Text>;
  if (error) return <Text color={COLORS.error}>Error: {error}</Text>;

  if (sessions.length === 0) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color={COLORS.muted}>No sessions to attach to.</Text>
        <Text color={COLORS.muted}>Press Esc to go back</Text>
      </Box>
    );
  }

  if (selected) {
    const args = buildAttachSession(selected, env.isInsideTmux);
    return (
      <CommandPreview
        command={formatCommandForDisplay(args)}
        onExecute={() => {
          if (env.isInsideTmux) {
            const res = executeTmuxCommand(args);
            addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
            setResult(res);
          } else {
            // Outside tmux: set pending attach, then exit ink cleanly.
            // cli.tsx will run the actual attach after ink fully unmounts.
            addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: 0 });
            setPendingAttach(selected);
            exit();
          }
        }}
        onCancel={() => { setSelected(null); setResult(null); }}
        result={result}
      />
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={COLORS.accent}>Select session to {env.isInsideTmux ? 'switch to' : 'attach'}:</Text>
      <Select
        options={sessions.map(s => ({
          label: `${s.name}${s.attached ? ' (attached)' : ''} - ${s.windows} window${s.windows !== 1 ? 's' : ''}`,
          value: s.name,
        }))}
        onChange={setSelected}
      />
    </Box>
  );
}
