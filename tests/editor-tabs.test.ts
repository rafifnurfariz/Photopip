import { describe, expect, it } from "vitest";
import { nextTabIndex } from "@/features/editor/tabs";

describe("tablist keys", () => {
  it("wraps left and right", () => {
    expect(nextTabIndex(5, 0, "ArrowLeft")).toBe(4);
    expect(nextTabIndex(5, 4, "ArrowRight")).toBe(0);
    expect(nextTabIndex(5, 2, "ArrowRight")).toBe(3);
  });

  it("jumps to the ends and ignores other keys", () => {
    expect(nextTabIndex(5, 3, "Home")).toBe(0);
    expect(nextTabIndex(5, 3, "End")).toBe(4);
    expect(nextTabIndex(5, 3, "Tab")).toBeNull();
    expect(nextTabIndex(0, 0, "ArrowRight")).toBeNull();
  });
});
