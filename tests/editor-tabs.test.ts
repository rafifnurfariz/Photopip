// unit test kecil buat navigasi keyboard di tab editor (nextTabIndex)
// ngecek muter kiri/kanan, loncat awal/akhir, sama ngabaikan tombol lain
import { describe, expect, it } from "vitest";
import { nextTabIndex } from "@/features/editor/tabs";

describe("tablist keys", () => {
  // cek panah kiri dari awal muter ke belakang dan panah kanan dari ujung balik ke 0
  it("wraps left and right", () => {
    expect(nextTabIndex(5, 0, "ArrowLeft")).toBe(4);
    expect(nextTabIndex(5, 4, "ArrowRight")).toBe(0);
    expect(nextTabIndex(5, 2, "ArrowRight")).toBe(3);
  });

  // cek tombol Home/End loncat ke ujung, dan tombol selain itu balikin null
  it("jumps to the ends and ignores other keys", () => {
    expect(nextTabIndex(5, 3, "Home")).toBe(0);
    expect(nextTabIndex(5, 3, "End")).toBe(4);
    expect(nextTabIndex(5, 3, "Tab")).toBeNull();
    expect(nextTabIndex(0, 0, "ArrowRight")).toBeNull();
  });
});
