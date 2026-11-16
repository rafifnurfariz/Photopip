export interface Sticker {
  id: string;
  name: string;
  src: string;
  tags: string[];
  category?: string;
}

/**
 * Built-in static stickers catalog.
 * Empty by default — all stickers are discovered dynamically from
 * public/assets/stickers/ via the /api/stickers scanner route.
 */
export const stickers: Sticker[] = [];
