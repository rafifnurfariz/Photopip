import { describe, expect, it } from "vitest";
import { axisScroll } from "@/features/editor/hooks/scroll-reveal";

describe("axisScroll", () => {
  it("keeps a visible box where it is", () => {
    expect(axisScroll(100, 80, 60, 300)).toBe(60);
  });

  it("centres a box clipped at either edge", () => {
    expect(axisScroll(500, 100, 0, 300)).toBe(400);
    expect(axisScroll(250, 100, 0, 300)).toBe(150);
  });

  it("clamps to the top when the box is above the viewport", () => {
    expect(axisScroll(10, 50, 400, 300)).toBe(0);
  });

  it("aligns a box taller than the viewport to its start", () => {
    expect(axisScroll(200, 800, 0, 300)).toBe(200);
  });
});
