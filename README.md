<div align="center">
  <img src="public/assets/brand/logo.png" alt="Logo Photopip" width="120" />
  <h1>Photopip</h1>
  <p>Aplikasi web <em>photobooth</em> dan editor foto interaktif berbasis Next.js dan Fabric.js dengan dukungan beragam tema bingkai, stiker, font kustom, serta 7 pilihan bahasa.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.4.5-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.3.0-20232A?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Fabric.js-7.4.0-FF6B6B?style=for-the-badge" alt="Fabric.js" />
    <img src="https://img.shields.io/badge/Sharp-0.35.5-99CC00?style=for-the-badge" alt="Sharp" />
  </p>
</div>

---

## ✨ Fitur Utama

| Fitur                                   | Deskripsi                                                                                                                                                                                                                   |
| :-------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 📸 **Studio Photobooth Interaktif**     | Pengambilan foto langsung via kamera perangkat (`use-camera`, `booth-stage`) menggunakan Web API kamera browser lengkap dengan hitung mundur, _film strip_ pratinjau, serta opsi unggah foto dari galeri.                   |
| 🖼️ **Layout & Frame Pack Tematik**      | Mendukung format `single`, `2x2`, `2x3`, `3x1`, dan `4x1` dengan pack bawaan seperti `default`, `cyber-glow`, `gta-6`, `matcha-latte`, `minecraft`, `monochrome-noir`, `pastel-party`, `retro-night`, dan `sunset-vibes`.   |
| 🎨 **Editor Foto & Manajemen Layer**    | Kanvas interaktif berbasis **Fabric.js** dengan riwayat _Undo/Redo_, pengaturan urutan _layer_ (`layer-list`), filter foto (`photo-filters`), stiker (`cute`, `emoji`, `food`, `nature`, `y2k`), dan kustomisasi teks/font. |
| ⚡ **Auto-Discovery Asset API**         | Endpoint `/api/frames`, `/api/stickers`, dan `/api/fonts` memindai aset di folder `public/assets/` secara otomatis.                                                                                                         |
| 🌐 **Dukungan Multi-Bahasa (7 Bahasa)** | Antarmuka tersedia dalam bahasa **Indonesia (`id`)**, **Inggris (`en`)**, **Jerman (`de`)**, **Spanyol (`es`)**, **Prancis (`fr`)**, **Jepang (`ja`)**, dan **Mandarin (`zh`)**.                                            |
| 📱 **PWA Ready & Ekspor Instan**        | Dilengkapi `manifest.json` dan ikon aplikasi agar dapat dipasang sebagai aplikasi web, serta ekspor hasil komposisi foto ke perangkat.                                                                                      |

---

## 🛠️ Teknologi yang Digunakan

- **Next.js (`^16.4.5`) & React (`^19.3.0`):** Kerangka web utama untuk struktur halaman (`src/app/`), antarmuka pengguna, serta _API routes_ (`/api/frames`, `/api/stickers`, `/api/fonts`).
- **Fabric.js (`7.4.0`):** _Library_ kanvas interaktif terpisah di atas Next.js yang digunakan di editor foto untuk mengatur posisi, skala, rotasi, _layer_ stiker/teks, dan komposisi visual.
- **Sharp (`0.35.5`):** Pemrosesan gambar di sisi server. Dipakai `src/shared-tools/catalog/frame-pack.ts` untuk membaca artwork PNG dan menurunkan warna tema bingkai (latar strip serta warna teks footer).
- **TypeScript (`5.9.3`) & CSS (`src/app/globals.css` + `next-themes`):** Pengetikan tipe statis, _styling_ global, dan pengelolaan tema.
- **Vitest (`4.1.11`), React Testing Library (`16.3.0`), ESLint, Prettier & Knip:** Pengujian unit/komponen, pengecekan _lint/formatting_, dan audit kode.

---

## 📋 Prasyarat Instalasi

Sebelum menjalankan proyek secara lokal, siapkan kebutuhan berikut:

- **Node.js versi `>= 22.0.0`:** Saat kamu menginstal Node.js, **npm** (paket manajer untuk menjalankan perintah seperti `npm install` dan `npm run dev`) sudah otomatis ikut terpasang di dalamnya.
- **Browser modern:** Mendukung akses kamera (`MediaDevices.getUserMedia`) jika ingin memotret langsung dari webcam atau kamera perangkat.
- **Secure context untuk kamera:** Browser hanya mengizinkan kamera di `localhost` atau HTTPS. Membuka `http://192.168.x.x:3000` dari HP di jaringan lokal akan ditolak browser; gunakan tunnel HTTPS bila perlu menguji kamera dari perangkat lain.

---

## 🚀 Instalasi & Menjalankan Proyek

1. **Clone repositori ini:**

   ```bash
   git clone https://github.com/rafifnurfariz/Photopip.git
   cd Photopip
   ```

2. **Instal seluruh dependensi:**

   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (_development_):**

   ```bash
   npm run dev
   ```

4. **Buka di browser:**
   Akses **`http://localhost:3000`** untuk mulai menggunakan Photopip.

5. **Menjalankan pengujian & build produksi:**

   ```bash
   # Menjalankan unit & component test dengan Vitest
   npm test

   # Membuat build produksi
   npm run build
   npm start
   ```

---

## ⚙️ Perintah npm

| Perintah                              | Fungsi                                                                           |
| :------------------------------------ | :------------------------------------------------------------------------------- |
| `npm run dev`                         | Dev server (menyinkronkan `frame-dates.json` lebih dulu).                        |
| `npm run build`                       | Build produksi, lalu menyalin `public/` dan `.next/static` ke output standalone. |
| `npm start`                           | Menjalankan hasil build dari `.next/standalone/server.js`.                       |
| `npm test`                            | Seluruh tes Vitest.                                                              |
| `npx vitest run tests/<file>.test.ts` | Menjalankan satu file tes.                                                       |
| `npx vitest`                          | Mode watch.                                                                      |
| `npm run lint`                        | ESLint; gagal bila ada warning.                                                  |
| `npm run type-check`                  | `tsc --noEmit`.                                                                  |
| `npm run format` / `format:check`     | Prettier menulis ulang / hanya memeriksa format.                                 |
| `npm run deadcode`                    | Knip, mendeteksi file dan ekspor yang tidak terpakai.                            |
| `npm run audit:production`            | `npm audit --omit=dev` untuk dependensi produksi.                                |
| `npm run verify`                      | Format check → type check → lint → test → deadcode → audit → build.              |

Jalankan `npm run verify` sebelum commit atau membuka pull request.

---

## 🔧 Variabel Lingkungan

Tidak ada variabel yang wajib diisi. Yang tersedia:

| Variabel               | Fungsi                                                                                                                                                     |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | URL absolut situs untuk metadata dan Open Graph (`src/app/layout.tsx`). Bila kosong, dipakai `https://$VERCEL_URL`, lalu fallback `http://localhost:3000`. |
| `VERCEL_URL`           | Diisi otomatis oleh Vercel dan hanya dipakai sebagai fallback di atas.                                                                                     |

---

## 🔌 Endpoint API

Tiga route baca-saja, berjalan di Node.js runtime dengan `Cache-Control: no-store`:

| Endpoint            | Respons                                                                                                          |
| :------------------ | :--------------------------------------------------------------------------------------------------------------- |
| `GET /api/frames`   | `{ frames: FramePackFrame[], diagnostics: Diagnostic[] }` — `diagnostics` hanya berisi data di mode development. |
| `GET /api/stickers` | `{ stickers: Sticker[], categories: string[] }` — mengembalikan array kosong bila pemindaian gagal.              |
| `GET /api/fonts`    | `{ fonts: TextFont[] }` — mengembalikan array kosong bila pemindaian gagal.                                      |

---

## 🔒 Privasi

Semua pengolahan foto berjalan di browser: kamera, filter, komposisi, sampai ekspor PNG/JPEG. Foto tidak pernah diunggah ke server; server hanya memindai nama file aset di `public/assets/`. `next.config.mjs` memasang CSP `default-src 'self'`, `script-src 'self'`, `font-src 'self'`, `connect-src 'self'`, dan `Permissions-Policy` yang hanya mengizinkan kamera, sehingga tidak ada script, font, atau analytics dari domain luar.

---

## 📂 Susunan Project

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

## 💡 Contoh Penggunaan

### 1. Sesi Photobooth & Editing Dasar

1. Buka `http://localhost:3000` dan izinkan akses kamera pada browser (atau unggah foto dari perangkat).
2. Pilih **Layout Template** (misalnya `4x1` atau `2x2`) dan **Frame Pack** pilihanmu (contoh: `cyber-glow` atau `matcha-latte`).
3. Tekan tombol **Capture** untuk mengambil foto sesuai slot template.
4. Masuk ke mode **Editor** untuk menerapkan filter foto, menambahkan stiker atau teks, dan mengatur urutan _layer_.
5. Klik tombol **Export** untuk mengunduh hasil akhir ke perangkat.

### 2. Cara Menambah Frame Pack Baru

Scanner memakai kontrak tetap (`src/app/api/frames/scan.ts`):

1. Salin folder `public/assets/frame-packs/_starter/` (bukan `default/`) menjadi folder baru, misalnya:
   ```text
   public/assets/frame-packs/vintage-film/
   ```
   Nama folder menjadi nama bingkai. Folder berawalan `_` — termasuk `_starter` — dilewati scanner.
2. Ganti kelima PNG di dalamnya. Ukuran piksel harus **persis** seperti tabel; bila beda, pack ditolak dan dilewati:

   | File         | Ukuran      |
   | :----------- | :---------- |
   | `single.png` | 1200 × 1800 |
   | `2x2.png`    | 1200 × 1200 |
   | `2x3.png`    | 1200 × 1800 |
   | `3x1.png`    | 600 × 1350  |
   | `4x1.png`    | 600 × 1800  |

3. Biarkan area slot foto transparan. Artwork digambar di atas foto, jadi piksel opaque akan menutupi foto; 12% bagian bawah kanvas dicadangkan untuk logo PhotoPip.
4. Tidak ada `frame.json`. Warna latar strip diambil dari warna opaque paling dominan di `single.png`, dan warna teks footer dipilih otomatis (gelap atau putih) agar tetap terbaca.
5. Muat ulang halaman; `/api/frames` memindai folder dan menampilkan pack baru. Pack yang rusak dilewati, dan alasannya muncul di `diagnostics` saat `npm run dev`.

Kontrak di atas adalah yang dibaca scanner; perhitungan posisi dan ukuran slot ada di `src/shared-tools/composition/geometry.ts`.

### 3. Cara Menambah Stiker Baru

1. Pilih folder kategori stiker yang sudah ada di `public/assets/stickers/` (seperti `cute/`, `emoji/`, `food/`, `nature/`, atau `y2k/`), atau buat folder kategori baru di dalamnya:
   ```text
   public/assets/stickers/cute/
   ```
2. Masukkan file gambar stiker (disarankan PNG berlatar transparan), misalnya `star_sparkle.png`. Ekstensi yang dibaca: `.png`, `.webp`, `.jpg`, `.jpeg`.
3. Muat ulang halaman aplikasi, maka endpoint `/api/stickers` akan otomatis memindai file stiker dari folder tersebut agar muncul di panel stiker editor. Nama tampilan diambil dari nama file (`star_sparkle` → "Star Sparkle"); file yang diletakkan langsung di `public/assets/stickers/` masuk kategori `all`.

### 4. Cara Menambah Font Baru

1. Masukkan file font berekstensi `.ttf` (hanya `.ttf` yang dibaca, dan hanya di level atas folder) ke folder:
   ```text
   public/assets/fonts/
   ```
   _(Contoh: `public/assets/fonts/Poppins-Bold.ttf`)_
2. Muat ulang halaman aplikasi, maka endpoint `/api/fonts` akan otomatis mendeteksi font di `public/assets/fonts/` sehingga bisa langsung dipilih pada panel teks di editor. Font UI bawaan (Segoe UI) berada di `src/assets/fonts/` dan dimuat lewat `next/font/local`, bukan dari folder ini.
