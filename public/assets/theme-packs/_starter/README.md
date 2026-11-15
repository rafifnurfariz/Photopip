# Starter theme pack

This folder is a guide, not a theme: the scanner ignores folders that start with `_`.

To make a theme:

1. Copy this folder to `public/assets/theme-packs/my-theme`.
2. Replace the five artwork PNGs. Keep their exact print sizes and leave the photo areas
   transparent.
3. Optionally replace `preview.png` with a square cover (240 × 240 recommended). The theme
   card layers the artwork over neutral slot placeholders, so this file is not required.
4. Edit `theme.json` (all fields are optional).
5. Refresh the app and open the Theme tool.

Artwork is drawn above the photos and slot outlines. Each grey rectangle is a photo slot;
its interior is transparent, so the photo shows through. Opaque pixels cover the photo, so
you can add rings or decorations over it. Photos are not clipped to the transparent shape;
align the artwork to the slot rectangle. The bottom 12% of the canvas is reserved for the
PhotoPip logo. The card layers the artwork over neutral slot placeholders.

See `docs/THEMES.md` for the full contract and the slot map.
