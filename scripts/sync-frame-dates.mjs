// script buat nyatet tanggal pertama kali tiap folder bingkai ditambahin ke project
// hasilnya disimpan ke frame-dates.json supaya daftar bingkai bisa diurutin dari yang terbaru
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

// skip script ini kalau lagi build di Vercel atau CI biar pakai data json yang sudah ada
if (process.env.VERCEL || process.env.CI) {
  process.exit(0);
}

// lokasi folder bingkai di public dan file json tujuan
const root = path.join(process.cwd(), "public", "assets", "frame-packs");
const targetFile = path.join(
  process.cwd(),
  "src",
  "shared-tools",
  "catalog",
  "frame-dates.json",
);

// baca data tanggal lama dulu kalau filenya sudah ada
let existing = {};
try {
  existing = JSON.parse(readFileSync(targetFile, "utf8"));
} catch {
  existing = {};
}

// scan semua subfolder bingkai, lewati folder yang diawali underscore kayak _starter
let folders = [];
try {
  folders = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort();
} catch {
  folders = [];
}

// objek baru buat nampung pasangan nama folder dan timestamp-nya
const updated = {};

for (const folder of folders) {
  // kalau sudah tercatat sebelumnya, pakai angka lama biar gak berubah-ubah
  if (existing[folder] && typeof existing[folder] === "number") {
    updated[folder] = existing[folder];
    continue;
  }

  const dirPath = `public/assets/frame-packs/${folder}`;
  let time = null;

  // coba cari tanggal commit saat folder ini pertama kali ditambahin di git
  try {
    const out = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--format=%ct", "-n", "1", "--", dirPath],
      { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] },
    ).trim();
    if (out) {
      const parsed = parseInt(out, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        // konversi detik dari git ke milidetik
        time = parsed * 1000;
      }
    }
  } catch {
    // Git might not be available in environment
  }

  // kalau cara pertama gagal, ambil commit paling awal yang nyentuh folder ini
  if (!time) {
    try {
      const out = execFileSync(
        "git",
        ["log", "--format=%ct", "-n", "1", "--reverse", "--", dirPath],
        { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] },
      ).trim();
      if (out) {
        const parsed = parseInt(out, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          time = parsed * 1000;
        }
      }
    } catch {
      // Ignore git log fallback error
    }
  }

  // cadangan kalau git gak nemu, cek lagi data lama
  if (!time && existing[folder] && typeof existing[folder] === "number") {
    time = existing[folder];
  }

  // kalau belum di-commit juga, ambil waktu pembuatan folder dari sistem file
  if (!time) {
    try {
      const s = statSync(path.join(root, folder));
      time = Math.round(s.birthtimeMs || s.mtimeMs || Date.now());
    } catch {
      time = Date.now();
    }
  }

  updated[folder] = time;
}

// bandingin isi json baru dan lama biar gak nulis ulang kalau gak ada perubahan
const outputJson = JSON.stringify(updated, null, 2) + "\n";
const currentJson = JSON.stringify(existing, null, 2) + "\n";

if (outputJson !== currentJson) {
  writeFileSync(targetFile, outputJson, "utf8");
  console.log(`[sync-frame-dates] Updated ${targetFile}`);
}
