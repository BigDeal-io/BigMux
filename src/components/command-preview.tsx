import React from 'react';
import { Box, Text, useInput } from 'ink';
import { COLORS } from '../constants.js';
import { useClipboard } from '../hooks/use-clipboard.js';

interface CommandPreviewProps {
  command: string;
  onExecute: () => void;
  onCancel: () => void;
  result?: { stdout: string; stderr: string; exitCode: number } | null;
}

export function CommandPreview({ command, onExecute, onCancel, result }: CommandPreviewProps) {
  const { copied, clipError, copyToClipboard } = useClipboard();

  useInput((input, key) => {
    if (input === 'x' && !result) {
      onExecute();
    }
    if (input === 'c' && !result) {
      copyToClipboard(command);
    }
    if (key.escape) {
      onCancel();
    }
    if (key.return && result) {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column" borderStyle="round" borderColor={COLORS.primary} paddingX={1}>
        <Text color={COLORS.muted}>Command:</Text>
        <Text bold color={COLORS.secondary}>{command}</Text>
      </Box>

      {result ? (
        <Box flexDirection="column" gap={1}>
          {result.exitCode === 0 ? (
            <Text color={COLORS.success}>Command executed successfully.</Text>
          ) : (
            <Text color={COLORS.error}>Command failed (exit code {result.exitCode})</Text>
          )}
          {result.stdout.trim() && (
            <Box flexDirection="column">
              <Text color={COLORS.muted}>Output:</Text>
              <Text>{result.stdout.trim()}</Text>
            </Box>
          )}
          {result.stderr.trim() && (
            <Box flexDirection="column">
              <Text color={COLORS.muted}>Error:</Text>
              <Text color={COLORS.error}>{result.stderr.trim()}</Text>
            </Box>
          )}
          <Text color={COLORS.muted}>Press Enter to continue</Text>
        </Box>
      ) : (
        <Box gap={2}>
          <Text color={COLORS.accent}>x Execute</Text>
          <Text color={COLORS.accent}>c Copy</Text>
          <Text color={COLORS.muted}>Esc Cancel</Text>
          {copied && <Text color={COLORS.success}>Copied!</Text>}
          {clipError && <Text color={COLORS.error}>{clipError}</Text>}
        </Box>
      )}
    </Box>
  );
}
