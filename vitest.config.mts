// konfigurasi Vitest buat jalanin semua unit test di folder tests
// ngatur alias path @/ ke folder src dan environment jsdom buat simulasi browser
import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: {
    // biar import pakai @/ langsung ngarah ke folder src
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    // pakai jsdom supaya komponen React bisa dites tanpa buka browser beneran
    environment: "jsdom",
    // lokasi file test yang bakal dideteksi Vitest
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
