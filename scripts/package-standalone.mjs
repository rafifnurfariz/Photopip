// script pelengkap build standalone Next.js
// nyalin folder public dan aset static ke dalam .next/standalone supaya server bisa langsung jalan
import { cp, mkdir } from "node:fs/promises";
// bikin folder tujuan dulu kalau belum ada
await mkdir(".next/standalone/.next", { recursive: true });
// salin aset publik kayak bingkai, stiker, font, dan ikon
await cp("public", ".next/standalone/public", { recursive: true });
// salin hasil bundle js dan css static dari Next.js
await cp(".next/static", ".next/standalone/.next/static", { recursive: true });
