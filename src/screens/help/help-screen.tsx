import React from 'react';
import { Box, Text, useInput } from 'ink';
import { APP_AUTHOR, APP_AUTHOR_URL, APP_COMPANY, APP_LOGO, APP_TAGLINE, APP_VERSION, COLORS } from '../../constants.js';

interface HelpScreenProps {
  onBack: () => void;
}

export function HelpScreen({ onBack }: HelpScreenProps) {
  useInput((_input, key) => {
    if (key.escape) onBack();
  });

  return (
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column">
        {APP_LOGO.map((line, i) => (
          <Text key={i} bold color={COLORS.primary}>{line}</Text>
        ))}
        <Text color={COLORS.muted}>{APP_TAGLINE}</Text>
      </Box>

      <Box flexDirection="column">
        <Text bold color={COLORS.accent}>Keybindings</Text>
        <Text color={COLORS.text}>  {'\u2191\u2193'}        Navigate menu items</Text>
        <Text color={COLORS.text}>  Enter     Select / confirm</Text>
        <Text color={COLORS.text}>  Esc       Go back / cancel</Text>
        <Text color={COLORS.text}>  q         Quit (from main menu)</Text>
        <Text color={COLORS.text}>  ?         Open this help screen</Text>
        <Text color={COLORS.text}>  x         Execute previewed command</Text>
        <Text color={COLORS.text}>  c         Copy command to clipboard</Text>
        <Text color={COLORS.text}>  y/n       Confirm/deny dialogs</Text>
      </Box>

      <Box flexDirection="column">
        <Text bold color={COLORS.accent}>tmux Concepts</Text>
        <Text color={COLORS.text}>  Session   A collection of windows. Can be detached/reattached.</Text>
        <Text color={COLORS.text}>  Window    A tab within a session. Contains one or more panes.</Text>
        <Text color={COLORS.text}>  Pane      A split within a window. Each runs a shell.</Text>
      </Box>

      <Box flexDirection="column">
        <Text bold color={COLORS.accent}>Command Preview</Text>
        <Text color={COLORS.text}>  Every operation shows the tmux command before running it.</Text>
        <Text color={COLORS.text}>  You can execute it, copy it to clipboard, or cancel.</Text>
        <Text color={COLORS.text}>  This helps you learn tmux commands as you use bigmux.</Text>
      </Box>

      <Box flexDirection="column">
        <Text bold color={COLORS.accent}>Inside vs Outside tmux</Text>
        <Text color={COLORS.text}>  Outside: Session create/list/attach work. Attach launches tmux.</Text>
        <Text color={COLORS.text}>  Inside:  All operations work. Attach uses switch-client.</Text>
        <Text color={COLORS.text}>  Window/Pane menus require being inside a tmux session.</Text>
      </Box>

      <Box flexDirection="column">
        <Text bold color={COLORS.accent}>About</Text>
        <Text color={COLORS.text}>  BIGMUX v{APP_VERSION}</Text>
        <Text color={COLORS.text}>  A product of <Text color={COLORS.primary}>{APP_AUTHOR}</Text></Text>
        <Text color={COLORS.text}>  A service of {APP_COMPANY}</Text>
        <Text color={COLORS.primary}>  {APP_AUTHOR_URL}</Text>
      </Box>

      <Text color={COLORS.muted}>Press Esc to go back</Text>
    </Box>
  );
}
