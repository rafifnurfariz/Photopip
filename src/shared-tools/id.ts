let counter = 0;

/**
 * `crypto.randomUUID` only exists in secure contexts, so a booth opened over
 * plain http on the LAN would crash the editor when adding a sticker or text.
 */
export function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
    return crypto.randomUUID();
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
