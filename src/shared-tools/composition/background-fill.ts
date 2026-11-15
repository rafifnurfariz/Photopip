import { Gradient, Pattern } from "fabric";
import type { ThemeBackground } from "@/shared-tools/catalog/themes";

function patternTile(kind: "stripes" | "dots" | "checker") {
  const tile = document.createElement("canvas");
  tile.width = 40;
  tile.height = 40;
  const context = tile.getContext("2d");
  if (!context) throw new Error("Pattern unavailable");
  context.fillStyle = "#f8fafc";
  context.fillRect(0, 0, 40, 40);
  if (kind === "stripes") {
    context.strokeStyle = "#e2e8f0";
    context.lineWidth = 10;
    for (let i = -40; i <= 80; i += 20) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i + 40, 40);
      context.stroke();
    }
  } else if (kind === "dots") {
    context.fillStyle = "#cbd5e1";
    for (const [x, y] of [
      [10, 10],
      [30, 30],
    ]) {
      context.beginPath();
      context.arc(x, y, 3.5, 0, Math.PI * 2);
      context.fill();
    }
  } else {
    context.fillStyle = "#e2e8f0";
    context.fillRect(0, 0, 20, 20);
    context.fillRect(20, 20, 20, 20);
  }
  return tile;
}

export function backgroundFill(
  background: ThemeBackground,
  width: number,
  height: number,
) {
  if (background.type === "color") return background.value;
  if (background.type === "gradient") {
    const colors = [
      ...background.value.matchAll(/(#[a-f\d]{6})\s+(\d+)%/gi),
    ].map((match) => ({ color: match[1], offset: Number(match[2]) / 100 }));
    return new Gradient({
      type: "linear",
      coords: { x1: 0, y1: 0, x2: width, y2: height },
      colorStops: colors,
    });
  }
  return new Pattern({
    source: patternTile(background.pattern),
    repeat: "repeat",
  });
}
