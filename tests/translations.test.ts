// unit test buat helper isLanguage di modul terjemahan
// ngecek semua kode locale valid diterima dan nama properti bawaan Object ditolak
import { describe, expect, it } from "vitest";
import { isLanguage, messages } from "@/translations";

describe("isLanguage", () => {
  // semua key yang ada di objek messages harus lolos validasi
  it("accepts every locale in the dictionary", () => {
    for (const id of Object.keys(messages)) expect(isLanguage(id)).toBe(true);
  });

  // cegah key properti prototype kayak toString atau __proto__ dianggap kode bahasa
  it("rejects inherited object properties and empty values", () => {
    for (const value of [
      "toString",
      "constructor",
      "__proto__",
      "valueOf",
      "",
      "ID",
    ])
      expect(isLanguage(value)).toBe(false);
  });
});
