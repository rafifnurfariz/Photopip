<div align="center">
  <img src="public/assets/brand/logo.png" alt="Logo Photopip" width="120" />
  <h1>Photopip</h1>
  <p>Aplikasi web photobooth dan editor foto interaktif berbasis Next.js dan Fabric.js dengan dukungan beragam frame custom, stiker custom, font kustom, serta 7 pilihan bahasa</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.4.5-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.3.0-20232A?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Fabric.js-7.4.0-FF6B6B" alt="Fabric.js" />
    <img src="https://img.shields.io/badge/Sharp-0.35.5-99CC00" alt="Sharp" />
  </p>

  <p>
    <a href="https://photopip.vercel.app/">Buka Website</a>
    &nbsp;|&nbsp;
    <a href="https://github.com/rafifnurfariz/Photopip">Repositori GitHub</a>
  </p>
</div>

---

## 📌 Fitur

| Fitur                | Keterangan                                                                                                                                                              |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Photobooth           | Foto diambil langsung dari kamera browser (`use-camera`, `booth-stage`). Ada hitung mundur dan pratinjau film strip. Bisa juga upload foto dari galeri.                 |
| Layout dan frame     | Ada 5 layout: `single`, `2x2`, `2x3`, `3x1`, dan `4x1`. Frame pack yang tersedia: `default`, `cyber-glow`, `gta-6`, `matcha-latte`, `minecraft`, `monochrome-noir`, `pastel-party`, `retro-night`, dan `sunset-vibes`. |
| Editor foto          | Canvas pakai Fabric.js. Ada undo/redo, daftar layer (`layer-list`), filter foto (`photo-filters`), stiker (`cute`, `emoji`, `food`, `nature`, `y2k`), serta teks dan font sendiri. |
| Scan asset otomatis  | `/api/frames`, `/api/stickers`, dan `/api/fonts` membaca isi folder `public/assets/` sendiri.                                                                           |
| 7 bahasa             | Indonesia (`id`), Inggris (`en`), Jerman (`de`), Spanyol (`es`), Prancis (`fr`), Jepang (`ja`), dan Mandarin (`zh`).                                                    |
| PWA dan ekspor       | Ada `manifest.json` dan ikon, jadi bisa dipasang seperti aplikasi. Hasil foto bisa diekspor ke perangkat.                                                               |

---

## ⚙️ Teknologi yang Dipakai

- **Next.js (`^16.4.5`) dan React (`^19.3.0`):** Dipakai untuk halaman (`src/app/`), tampilan, dan API route (`/api/frames`, `/api/stickers`, `/api/fonts`).
- **Fabric.js (`7.4.0`):** Dipakai di editor untuk mengatur posisi, ukuran, rotasi, dan layer stiker atau teks di canvas.
- **Sharp (`0.35.5`):** Memproses gambar di sisi server. File `src/shared-tools/catalog/frame-pack.ts` memakainya untuk membaca PNG frame, lalu mengambil warna tema (warna latar strip dan warna teks footer).
- **TypeScript (`5.9.3`) dan CSS (`src/app/globals.css` + `next-themes`):** TypeScript untuk tipe data, CSS untuk tampilan dan tema.
- **Vitest (`4.1.11`), React Testing Library (`16.3.0`), ESLint, Prettier, dan Knip:** Untuk testing, cek lint dan format, serta cari kode yang tidak terpakai.

---

## 📝 Yang Perlu Disiapkan

- **Node.js versi `>= 22.0.0`.**
- **Browser modern** yang mendukung kamera (`MediaDevices.getUserMedia`)
- **Secure context untuk kamera.** Browser cuma mengizinkan kamera di `localhost` atau HTTPS. Kalau buka `http://192.168.x.x:3000` dari HP lewat jaringan lokal, kamera akan ditolak. Untuk tes dari perangkat lain, pakai tunnel HTTPS.

---

## 🛠️ Cara Install dan Menjalankan

1. **Clone repositori:**

   ```bash
   git clone https://github.com/rafifnurfariz/Photopip.git
   cd Photopip
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

3. **Jalankan server development:**

   ```bash
   npm run dev
   ```

4. **Buka di browser:**
   Buka **`http://localhost:3000`**.

5. **Jalankan test dan build produksi:**

   ```bash
   # Menjalankan unit test dan component test dengan Vitest
   npm test

   # Membuat build produksi
   npm run build
   npm start
   ```

---

## 💻 Perintah npm

| Perintah                              | Fungsi                                                                              |
| :------------------------------------ | :---------------------------------------------------------------------------------- |
| `npm run dev`                         | Menjalankan dev server. Sebelumnya `frame-dates.json` disinkronkan dulu.            |
| `npm run build`                       | Build produksi, lalu menyalin `public/` dan `.next/static` ke output standalone.    |
| `npm start`                           | Menjalankan hasil build dari `.next/standalone/server.js`.                          |
| `npm test`                            | Menjalankan semua test Vitest.                                                      |
| `npx vitest run tests/<file>.test.ts` | Menjalankan satu file test saja.                                                    |
| `npx vitest`                          | Mode watch.                                                                         |
| `npm run lint`                        | ESLint. Akan gagal kalau ada warning.                                               |
| `npm run type-check`                  | `tsc --noEmit`.                                                                     |
| `npm run format` / `format:check`     | Prettier. `format` menulis ulang file, `format:check` hanya memeriksa.              |
| `npm run deadcode`                    | Knip, untuk mencari file dan ekspor yang tidak dipakai.                             |
| `npm run audit:production`            | `npm audit --omit=dev` untuk dependensi produksi.                                   |
| `npm run verify`                      | Menjalankan format check, type check, lint, test, deadcode, audit, lalu build.      |

Jalankan `npm run verify` sebelum commit atau bikin pull request.

---

## 🔒 Privasi

Semua proses foto dilakukan di browser, mulai dari kamera, filter, komposisi, sampai ekspor PNG/JPEG. Foto tidak pernah dikirim ke server. Server hanya membaca nama file asset di `public/assets/`. `next.config.mjs` memasang CSP `default-src 'self'`, `script-src 'self'`, `font-src 'self'`, dan `connect-src 'self'`. `Permissions-Policy` juga hanya mengizinkan kamera. Jadi tidak ada script, font, atau analytics dari domain luar.

---

## 📁 Struktur Project

```text
Photopip/
├── public/
│   ├── assets/
│   │   ├── app-icons/       # Favicon & ikon PWA (16x16 hingga 512x512)
│   │   ├── brand/           # Logo resmi aplikasi (logo.png)
│   │   ├── fonts/           # Font .ttf pilihan pengguna (dipindai /api/fonts)
│   │   ├── frame-packs/     # Satu folder per bingkai; _starter/ adalah template
│   │   └── stickers/        # Stiker per kategori (cute, emoji, food, nature, y2k)
│   └── manifest.json        # Konfigurasi Web App Manifest
├── scripts/                 # sync-frame-dates, package-standalone, audit-production
├── src/
│   ├── app/
│   │   ├── api/             # Route pemindai aset (frames, stickers, fonts)
│   │   ├── globals.css      # Satu-satunya file styling (CSS murni)
│   │   ├── layout.tsx       # Root layout, font lokal, metadata
│   │   └── page.tsx         # Halaman utama
│   ├── assets/fonts/        # Font UI bawaan (Segoe UI) via next/font/local
│   ├── components/          # Komponen lintas fitur (header, icons, theme-provider)
│   ├── features/
│   │   ├── editor/          # Kanvas Fabric.js, panel stiker/teks/bingkai, layer, history
│   │   └── studio/          # Kamera, sesi capture, film strip, pemilihan template
│   ├── shared-tools/
│   │   ├── catalog/         # Template, filter foto, font, frame pack, frame-dates.json
│   │   ├── composition/     # Geometri, renderer, ekspor, background
│   │   └── *.ts             # session, image-upload, async, id
│   └── translations/        # Provider i18n + locales/ (7 bahasa)
├── tests/                   # Suite Vitest (satu file per domain) + fixtures
├── eslint.config.mjs        # ESLint 9 flat config
├── next.config.mjs          # Konfigurasi Next.js, CSP, header keamanan
├── package.json             # Dependensi & skrip npm
├── tsconfig.json            # Konfigurasi TypeScript
└── vitest.config.mts        # Konfigurasi Vitest (jsdom)
```

---

## 🚀 Contoh Penggunaan

### 1. Sesi Photobooth dan Edit Dasar

1. Buka `http://localhost:3000`, lalu izinkan akses kamera di browser (atau upload foto dari perangkat).
2. Pilih **Layout Template** (misalnya `4x1` atau `2x2`) dan **Frame Pack** (misalnya `cyber-glow` atau `matcha-latte`).
3. Klik tombol **Capture** untuk memotret sesuai jumlah slot di template.
4. Masuk ke mode **Editor**. Di sini kamu bisa kasih filter, tambah stiker atau teks, dan atur urutan layer.
5. Klik **Export** untuk mengunduh hasil akhirnya.

### 2. Cara Menambah Frame Pack Baru

Scanner memakai aturan tetap (`src/app/api/frames/scan.ts`):

1. Salin folder `public/assets/frame-packs/_starter/` (jangan `default/`) jadi folder baru, contohnya:
   ```text
   public/assets/frame-packs/vintage-film/
   ```
   Nama folder jadi nama bingkainya. Folder yang namanya diawali `_`, termasuk `_starter`, akan dilewati scanner.
2. Ganti kelima file PNG di dalamnya. Ukuran pikselnya harus **persis** sama dengan tabel di bawah. Kalau beda, pack ditolak dan dilewati.

   | File         | Ukuran      |
   | :----------- | :---------- |
   | `single.png` | 1200 × 1800 |
   | `2x2.png`    | 1200 × 1200 |
   | `2x3.png`    | 1200 × 1800 |
   | `3x1.png`    | 600 × 1350  |
   | `4x1.png`    | 600 × 1800  |

3. Area slot foto harus dibiarkan transparan. Artwork digambar di atas foto, jadi piksel yang tidak transparan akan menutupi foto. Selain itu, 12% bagian bawah canvas disiapkan untuk logo PhotoPip.
4. Tidak perlu `frame.json`. Warna latar strip diambil dari warna opaque yang paling banyak di `single.png`. Warna teks footer dipilih otomatis (gelap atau putih) supaya tetap kebaca.
5. Refresh halaman, lalu `/api/frames` akan memindai folder dan menampilkan pack baru. Kalau ada pack yang rusak, pack itu dilewati dan alasannya muncul di `diagnostics` saat `npm run dev`.

Aturan di atas adalah yang dibaca scanner. Untuk hitungan posisi dan ukuran slot, lihat `src/shared-tools/composition/geometry.ts`.

### 3. Cara Menambah Stiker Baru

1. Pilih folder kategori yang sudah ada di `public/assets/stickers/` (`cute/`, `emoji/`, `food/`, `nature/`, atau `y2k/`), atau bikin folder kategori baru di situ:
   ```text
   public/assets/stickers/cute/
   ```
2. Taruh file gambar stikernya. Sebaiknya PNG dengan background transparan, misalnya `star_sparkle.png`. Ekstensi yang dibaca: `.png`, `.webp`, `.jpg`, `.jpeg`.
3. Refresh aplikasi, stiker baru akan muncul di panel stiker editor. Nama yang tampil diambil dari nama file (`star_sparkle` jadi "Star Sparkle"). File yang ditaruh langsung di `public/assets/stickers/` masuk ke kategori `all`.

### 4. Cara Menambah Font Baru

1. Taruh file font `.ttf` di folder berikut. Hanya `.ttf` yang dibaca, dan hanya yang ada di level paling atas folder.
   ```text
   public/assets/fonts/
   ```
   _(Contoh: `public/assets/fonts/Poppins-Bold.ttf`)_
2. Refresh aplikasi, font langsung bisa dipilih di panel teks editor. Font UI bawaan (Segoe UI) ada di `src/assets/fonts/` dan dimuat lewat `next/font/local`, bukan dari folder ini.
