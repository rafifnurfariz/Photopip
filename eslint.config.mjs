// file konfigurasi eslint buat ngecek kualitas kode js dan ts di project ini
// aturannya dipakai pas jalanin npm run lint biar kode tetap rapi dan bebas import nganggur
import js from "@eslint/js";
import ts from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";

// export konfigurasi utama eslint pakai flat config dari typescript-eslint
export default ts.config(
  {
    // folder hasil build dan file bawaan next.js nggak usah ikut dicek
    ignores: [".next/**", "node_modules/**", "output/**", "next-env.d.ts"],
  },
  // aturan dasar bawaan javascript, typescript, sama react hooks
  js.configs.recommended,
  ...ts.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    // aturan khusus file ts dan tsx buat deteksi import atau variabel yang gak kepakai
    files: ["**/*.{ts,tsx}"],
    plugins: { "unused-imports": unusedImports },
    rules: {
      // matiin rule bawaan biar gak bentrok sama plugin unused-imports
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      // variabel yang diawali underscore sengaja dibolehin gak kepakai
      "unused-imports/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // kasih tau eslint kalau file .mjs di node punya global process dan console
    files: ["**/*.mjs"],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
  },
);
