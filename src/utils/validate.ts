export function isValidSessionName(name: string): string | null {
  if (!name.trim()) return 'Name cannot be empty';
  if (name.includes('.')) return 'Name cannot contain "."';
  if (name.includes(':')) return 'Name cannot contain ":"';
  if (name.length > 64) return 'Name must be 64 characters or less';
  return null;
}

export function isValidWindowName(name: string): string | null {
  if (!name.trim()) return 'Name cannot be empty';
  if (name.length > 64) return 'Name must be 64 characters or less';
  return null;
}

export function isValidPercentage(value: number): string | null {
  if (value < 1 || value > 99) return 'Percentage must be between 1 and 99';
  if (!Number.isInteger(value)) return 'Percentage must be a whole number';
  return null;
}

export function isValidResizeAmount(value: number): string | null {
  if (value < 1 || value > 100) return 'Amount must be between 1 and 100';
  if (!Number.isInteger(value)) return 'Amount must be a whole number';
  return null;
}
