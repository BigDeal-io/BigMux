import React from 'react';
import { render } from 'ink';
import { execFileSync } from 'child_process';
import { Command } from 'commander';
import { App } from './app.js';
import { detectTmuxEnvironment } from './core/detector.js';
import { APP_AUTHOR, APP_AUTHOR_URL, APP_COMPANY, APP_NAME, APP_VERSION } from './constants.js';

// Shared state: if set before exit, cli will run this tmux command after ink unmounts
export let pendingAttach: string | null = null;
export function setPendingAttach(sessionName: string) {
  pendingAttach = sessionName;
}

const program = new Command();

program
  .name(APP_NAME)
  .description('BIGMUX \u2014 tmux, the easy way')
  .version(APP_VERSION, '-v, --version')
  .addHelpText('after', `\nA product of ${APP_AUTHOR} \u2014 a service of ${APP_COMPANY}\n${APP_AUTHOR_URL}`);

program.action(() => {
  const env = detectTmuxEnvironment();

  if (!env.tmuxAvailable) {
    console.error('Error: tmux is not installed or not in PATH.');
    console.error('Install tmux and try again.');
    process.exit(1);
  }

  const { waitUntilExit } = render(<App env={env} />, {
    exitOnCtrlC: true,
  });

  waitUntilExit().then(() => {
    if (pendingAttach) {
      try {
        execFileSync('tmux', ['attach-session', '-t', pendingAttach], { stdio: 'inherit' });
      } catch {
        // tmux attach ended (detach or session closed)
      }
    }
    process.exit(0);
  });
});

program.parse();
