export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function notDeleted() {
  return { deleted_at: null as Date | null };
}
