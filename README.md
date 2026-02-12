```
█▀▄ █ █▀▀ █▄ ▄█ █  █ ▀▄▀
█▀▄ █ █▄█ █ ▀ █ █  █  █
▀▀  ▀ ▀▀▀ ▀   ▀  ▀▀  ▀ ▀
```

**tmux, the easy way**

[![npm version](https://img.shields.io/npm/v/@bigdealio/bigmux.svg)](https://www.npmjs.com/package/@bigdealio/bigmux)
[![license](https://img.shields.io/npm/l/@bigdealio/bigmux.svg)](https://github.com/BigDeal-io/BigMux/blob/main/LICENSE)

BIGMUX is an interactive terminal UI for tmux. Instead of memorizing commands, navigate menus to manage sessions, windows, and panes. Every operation previews the exact tmux command before running it, so you learn tmux as you go.

## Install

```bash
npm install -g @bigdealio/bigmux
```

Requires [Node.js](https://nodejs.org/) >= 18 and [tmux](https://github.com/tmux/tmux) installed.

## Usage

```bash
bigmux
```

That's it. Arrow keys to navigate, Enter to select, Esc to go back, `q` to quit.

## Features

### Sessions
- **Create** new sessions with custom names
- **List** all running sessions
- **Attach** to or switch between sessions
- **Kill** sessions (with confirmation)

### Windows
- **Create** new windows in the current session
- **List** all windows with pane counts
- **Rename**, **move**, or **swap** windows
- **Kill** windows (with confirmation)

### Panes
- **Split** horizontally or vertically with custom percentages
- **Select** and switch between panes
- **Resize** in any direction by a configurable amount
- **Apply layouts** (even-horizontal, even-vertical, main-horizontal, main-vertical, tiled)
- **Swap** two panes

### Command Preview
Every operation shows the exact tmux command before execution. From the preview you can:
- **Execute** (`x`) - run the command
- **Copy** (`c`) - copy to clipboard
- **Cancel** (`Esc`) - go back without running

### Command History
- Browse all previously executed commands
- Re-execute, copy, or delete entries
- View timestamps and exit codes

### Context-Aware
BIGMUX detects whether you're inside or outside a tmux session and adjusts operations accordingly. Session attach uses `attach-session` from outside and `switch-client` from inside.

## Keybindings

| Key | Action |
|-----|--------|
| `Up` / `Down` | Navigate menu items |
| `Enter` | Select / confirm |
| `Esc` | Go back / cancel |
| `q` | Quit (from main menu) |
| `?` | Open help screen |
| `x` | Execute previewed command |
| `c` | Copy command to clipboard |
| `y` / `n` | Confirm / deny dialogs |

## Development

```bash
git clone https://github.com/BigDeal-io/BigMux.git
cd BigMux
npm install
npm run dev        # run with tsx
npm run build      # bundle to dist/
npm run typecheck   # type check
npm test           # run tests
```

## Built With

- [Ink](https://github.com/vadimdemedes/ink) - React for interactive CLIs
- [Commander](https://github.com/tj/commander.js) - CLI argument parsing
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

[MIT](LICENSE) - Copyright (c) 2025 Fractional CTO Solutions, a service of BIGDEALIO, LLC

---

A product of **[Fractional CTO Solutions](https://fractionalctosolutions.com)** - a service of **BIGDEALIO, LLC**
