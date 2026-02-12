import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Select } from '@inkjs/ui';
import { useTmux } from '../../hooks/use-tmux.js';
import { ConfirmDialog } from '../../components/confirm-dialog.js';
import { CommandPreview } from '../../components/command-preview.js';
import { buildKillSession, buildAttachSession, formatCommandForDisplay } from '../../core/tmux.js';
import { executeTmuxCommand } from '../../core/executor.js';
import { addHistoryEntry } from '../../core/history.js';
import { setPendingAttach } from '../../cli.js';
import { COLORS } from '../../constants.js';
import type { Screen, TmuxEnvironment, CommandResult } from '../../types.js';

interface SessionListProps {
  onSelect: (screen: Screen) => void;
  onBack: () => void;
  env: TmuxEnvironment;
}

type ListStep = 'list' | 'actions' | 'confirm-kill' | 'preview-kill' | 'preview-attach';

export function SessionList({ onSelect, onBack, env }: SessionListProps) {
  const { sessions, refreshSessions, loading, error } = useTmux();
  const { exit } = useApp();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [step, setStep] = useState<ListStep>('list');
  const [result, setResult] = useState<CommandResult | null>(null);

  useInput((_input, key) => {
    if (key.escape) {
      if (step === 'list') onBack();
      else {
        setStep('list');
        setSelectedSession(null);
        setResult(null);
        refreshSessions();
      }
    }
  });

  if (loading) {
    return <Text color={COLORS.muted}>Loading sessions...</Text>;
  }

  if (error) {
    return <Text color={COLORS.error}>Error: {error}</Text>;
  }

  if (sessions.length === 0) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color={COLORS.muted}>No tmux sessions running.</Text>
        <Text color={COLORS.accent}>Create one from Sessions {'>'} New Session</Text>
        <Text color={COLORS.muted}>Press Esc to go back</Text>
      </Box>
    );
  }

  if (step === 'preview-attach' && selectedSession) {
    const args = buildAttachSession(selectedSession, env.isInsideTmux);
    return (
      <CommandPreview
        command={formatCommandForDisplay(args)}
        onExecute={() => {
          if (env.isInsideTmux) {
            const res = executeTmuxCommand(args);
            addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
            setResult(res);
          } else {
            addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: 0 });
            setPendingAttach(selectedSession);
            exit();
          }
        }}
        onCancel={() => { setStep('actions'); setResult(null); }}
        result={result}
      />
    );
  }

  if (step === 'confirm-kill' && selectedSession) {
    return (
      <ConfirmDialog
        message={`Kill session "${selectedSession}"? This will close all windows and panes.`}
        onConfirm={() => setStep('preview-kill')}
        onCancel={() => { setStep('list'); setSelectedSession(null); }}
      />
    );
  }

  if (step === 'preview-kill' && selectedSession) {
    const args = buildKillSession(selectedSession);
    return (
      <CommandPreview
        command={formatCommandForDisplay(args)}
        onExecute={() => {
          const res = executeTmuxCommand(args);
          addHistoryEntry({ command: 'tmux', args, timestamp: Date.now(), exitCode: res.exitCode });
          setResult(res);
        }}
        onCancel={() => { setStep('list'); setSelectedSession(null); refreshSessions(); }}
        result={result}
      />
    );
  }

  if (step === 'actions' && selectedSession) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={COLORS.accent}>Session: {selectedSession}</Text>
        <Select
          options={[
            { label: 'Attach / Switch to', value: 'attach' },
            { label: 'Kill session', value: 'kill' },
          ]}
          onChange={(value) => {
            if (value === 'attach') {
              setStep('preview-attach');
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
      <Text bold color={COLORS.accent}>Sessions ({sessions.length})</Text>
      <Select
        options={sessions.map(s => ({
          label: `${s.name}${s.attached ? ' (attached)' : ''} - ${s.windows} window${s.windows !== 1 ? 's' : ''}`,
          value: s.name,
        }))}
        onChange={(value) => {
          setSelectedSession(value);
          setStep('actions');
        }}
      />
    </Box>
  );
}
