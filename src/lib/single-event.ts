import { AppError, defaultEvent } from './model';

/** All public invitation and contribution endpoints are scoped to this gathering. */
export function requireCurrentEvent(id: string): string {
  if (id !== defaultEvent.id) {
    throw new AppError('Deze uitnodiging bestaat niet.', 404);
  }
  return id;
}
