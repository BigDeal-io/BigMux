import React from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { ThemeProvider, extendTheme, defaultTheme } from '@inkjs/ui';
import { useNavigation } from './hooks/use-navigation.js';
import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import { MainMenu } from './screens/main-menu.js';
import { SessionMenu } from './screens/sessions/session-menu.js';
import { SessionNew } from './screens/sessions/session-new.js';
import { SessionList } from './screens/sessions/session-list.js';
import { SessionAttach } from './screens/sessions/session-attach.js';
import { WindowMenu } from './screens/windows/window-menu.js';
import { WindowNew } from './screens/windows/window-new.js';
import { WindowList } from './screens/windows/window-list.js';
import { WindowRename } from './screens/windows/window-rename.js';
import { WindowMove } from './screens/windows/window-move.js';
import { PaneMenu } from './screens/panes/pane-menu.js';
import { PaneSplit } from './screens/panes/pane-split.js';
import { PaneSelect } from './screens/panes/pane-select.js';
import { PaneResize } from './screens/panes/pane-resize.js';
import { PaneSwap } from './screens/panes/pane-swap.js';
import { CommandHistory } from './screens/command/command-history.js';
import { HelpScreen } from './screens/help/help-screen.js';
import type { TmuxEnvironment } from './types.js';
import { COLORS } from './constants.js';

const customTheme = extendTheme(defaultTheme, {
  components: {
    Select: {
      styles: {
        focusIndicator: () => ({ color: COLORS.primary }),
        label({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) {
          let color;
          if (isSelected) color = COLORS.secondary;
          if (isFocused) color = COLORS.primary;
          return { color, bold: isFocused };
        },
      },
    },
  },
});

interface AppProps {
  env: TmuxEnvironment;
}

export function App({ env }: AppProps) {
  const { exit } = useApp();
  const nav = useNavigation();

  useInput((input, key) => {
    if (input === 'q' && nav.current.type === 'main-menu') {
      exit();
    }
    if (input === '?' && nav.current.type !== 'help') {
      nav.push({ type: 'help' });
    }
  });

  function renderScreen() {
    switch (nav.current.type) {
      case 'main-menu':
        return <MainMenu onSelect={nav.push} env={env} />;
      case 'session-menu':
        return <SessionMenu onSelect={nav.push} onBack={nav.pop} />;
      case 'session-new':
        return <SessionNew onBack={nav.pop} env={env} />;
      case 'session-list':
        return <SessionList onSelect={nav.push} onBack={nav.pop} env={env} />;
      case 'session-attach':
        return <SessionAttach onBack={nav.pop} env={env} />;
      case 'window-menu':
        return <WindowMenu onSelect={nav.push} onBack={nav.pop} />;
      case 'window-new':
        return <WindowNew onBack={nav.pop} env={env} />;
      case 'window-list':
        return <WindowList onSelect={nav.push} onBack={nav.pop} env={env} />;
      case 'window-rename':
        return <WindowRename onBack={nav.pop} env={env} />;
      case 'window-move':
        return <WindowMove onBack={nav.pop} env={env} />;
      case 'pane-menu':
        return <PaneMenu onSelect={nav.push} onBack={nav.pop} />;
      case 'pane-split':
        return <PaneSplit onBack={nav.pop} env={env} />;
      case 'pane-select':
        return <PaneSelect onBack={nav.pop} env={env} />;
      case 'pane-resize':
        return <PaneResize onBack={nav.pop} env={env} />;
      case 'pane-swap':
        return <PaneSwap onBack={nav.pop} env={env} />;
      case 'command-history':
        return <CommandHistory onBack={nav.pop} />;
      case 'help':
        return <HelpScreen onBack={nav.pop} />;
    }
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box flexDirection="column" width="100%">
        <Header breadcrumbs={nav.breadcrumbs} env={env} />
        <Box flexDirection="column" paddingX={1} flexGrow={1}>
          {renderScreen()}
        </Box>
        <Footer screen={nav.current} />
      </Box>
    </ThemeProvider>
  );
}
