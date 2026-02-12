import { execFileSync } from 'child_process';
import type { CommandResult } from '../types.js';

export function executeTmuxCommand(args: string[]): CommandResult {
  try {
    const stdout = execFileSync('tmux', args, {
      encoding: 'utf-8',
      timeout: 10000,
    });
    return { stdout, stderr: '', exitCode: 0 };
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const execErr = err as { status: number | null; stdout: string | Buffer; stderr: string | Buffer };
      return {
        stdout: String(execErr.stdout ?? ''),
        stderr: String(execErr.stderr ?? ''),
        exitCode: execErr.status ?? 1,
      };
    }
    return {
      stdout: '',
      stderr: err instanceof Error ? err.message : String(err),
      exitCode: 1,
    };
  }
}
