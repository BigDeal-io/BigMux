import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import { HISTORY_FILE, MAX_HISTORY_ENTRIES } from '../constants.js';
import type { HistoryEntry } from '../types.js';

function ensureDir(): void {
  const dir = dirname(HISTORY_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function readHistory(): HistoryEntry[] {
  try {
    const data = readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(data) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function writeHistory(entries: HistoryEntry[]): void {
  ensureDir();
  const trimmed = entries.slice(-MAX_HISTORY_ENTRIES);
  writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
}

export function addHistoryEntry(entry: HistoryEntry): void {
  const entries = readHistory();
  entries.push(entry);
  writeHistory(entries);
}

export function clearHistory(): void {
  writeHistory([]);
}

export function deleteHistoryEntry(index: number): void {
  const entries = readHistory();
  if (index >= 0 && index < entries.length) {
    entries.splice(index, 1);
    writeHistory(entries);
  }
}
