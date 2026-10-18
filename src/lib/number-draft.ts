import { AppError } from './model';

/** Keep the user-entered text until validation. In particular '' must never turn into 0. */
export type NumberDraft = number | string;
export function resolveNumberDraft(raw: NumberDraft, min: number, max: number, label: string): number {
  if (String(raw).trim() === '') throw new AppError(`Vul ${label} in.`);
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new AppError(`${label} moet tussen ${min} en ${max} liggen.`);
  }
  return value;
}
