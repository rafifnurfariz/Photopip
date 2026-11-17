import { describe, expect, it } from "vitest";
import { isLanguage, messages } from "@/translations";

describe("isLanguage", () => {
  it("accepts every locale in the dictionary", () => {
    for (const id of Object.keys(messages)) expect(isLanguage(id)).toBe(true);
  });

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
