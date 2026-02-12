import React from 'react';
import { Box, Text, useInput } from 'ink';
import { COLORS } from '../constants.js';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  useInput((input, key) => {
    if (input === 'y' || input === 'Y') {
      onConfirm();
    }
    if (input === 'n' || input === 'N' || key.escape) {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.warning} paddingX={1}>
      <Text bold color={COLORS.warning}>{message}</Text>
      <Box gap={2} marginTop={1}>
        <Text color={COLORS.accent}>y Yes</Text>
        <Text color={COLORS.muted}>n No</Text>
      </Box>
    </Box>
  );
}
