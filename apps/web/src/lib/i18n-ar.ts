/**
 * @deprecated Prefer `useLocale().t` — kept so older imports keep working.
 */
export { messages } from "@/lib/i18n/messages";
export { messages as default } from "@/lib/i18n/messages";

import { messages } from "@/lib/i18n/messages";

/** Static Arabic dictionary (guest pages should use the locale hook). */
export const ar = messages.ar;
