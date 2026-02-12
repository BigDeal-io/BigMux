import React, { useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { COLORS } from '../constants.js';

interface ErrorDisplayProps {
  message: string;
  onDismiss?: () => void;
  autoDismiss?: number;
}

export function ErrorDisplay({ message, onDismiss, autoDismiss }: ErrorDisplayProps) {
  useInput((_input, key) => {
    if (key.escape || key.return) {
      onDismiss?.();
    }
  });

  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(onDismiss, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  return (
    <Box borderStyle="round" borderColor={COLORS.error} paddingX={1} flexDirection="column">
      <Text bold color={COLORS.error}>Error</Text>
      <Text color={COLORS.error}>{message}</Text>
      {onDismiss && <Text color={COLORS.muted}>Press Esc or Enter to dismiss</Text>}
    </Box>
  );
}
