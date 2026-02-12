import React from 'react';
import { Box, Text } from 'ink';
import { APP_LOGO, APP_TAGLINE, COLORS } from '../constants.js';
import type { TmuxEnvironment } from '../types.js';

interface HeaderProps {
  breadcrumbs: string[];
  env: TmuxEnvironment;
}

export function Header({ breadcrumbs, env }: HeaderProps) {
  const statusText = env.isInsideTmux
    ? `tmux ${env.tmuxVersion ?? ''} \u2502 session: ${env.currentSession ?? 'unknown'}`
    : `tmux ${env.tmuxVersion ?? ''} \u2502 not in session`;

  return (
    <Box flexDirection="column" width="100%">
      <Box justifyContent="space-between" width="100%" paddingX={1}>
        <Text bold color={COLORS.primary}>{APP_LOGO[0]}</Text>
        <Text color={COLORS.muted}>{statusText}</Text>
      </Box>
      {APP_LOGO.slice(1).map((line, i) => (
        <Box key={i} paddingX={1}>
          <Text bold color={COLORS.primary}>{line}</Text>
        </Box>
      ))}
      <Box paddingX={1}>
        <Text color={COLORS.muted}>{APP_TAGLINE}</Text>
      </Box>
      <Box paddingX={1}>
        <Text color={COLORS.muted}>
          {breadcrumbs.join(' \u203A ')}
        </Text>
      </Box>
      <Box width="100%" paddingX={1}>
        <Text color={COLORS.border}>{'\u2500'.repeat(60)}</Text>
      </Box>
    </Box>
  );
}
