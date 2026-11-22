# Starter frame pack

This folder is a guide, not a frame: the scanner ignores folders that start with `_`.

To make a frame:

1. Copy this folder to `public/assets/frame-packs/` and name it however you like
   (`my-frame`, `My Frame`, `GTA 6` all work). The app tidies the name for display.
2. Replace the five artwork PNGs. Keep their exact print sizes and leave the photo areas
   transparent.
3. Refresh the app and open the Frame tool. The card layers the artwork over neutral
   slot placeholders. There is no `preview.png`.

There is no `frame.json`: the scanner derives the strip background from the most common
opaque color in `single.png`, picks dark or white footer text to stay readable, and uses
the folder name as the frame name.

Artwork is drawn above the photos and slot outlines. Each grey rectangle is a photo slot;
its interior is transparent, so the photo shows through. Opaque pixels cover the photo, so
you can add rings or decorations over it. Photos are not clipped to the transparent shape;
align the artwork to the slot rectangle. The bottom 12% of the canvas is reserved for the
PhotoPip logo. The card layers the artwork over neutral slot placeholders.

See `README.md` for the full contract and the slot map.
