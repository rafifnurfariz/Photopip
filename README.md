# 📸 PhotoPip

PhotoPip adalah aplikasi **photo booth di browser**. Kamu bisa ambil foto pakai kamera laptop/HP, pilih tata letak seperti strip foto sungguhan, hias dengan tema dan stiker, lalu unduh hasilnya sebagai gambar siap cetak — semuanya terjadi langsung di browser, tanpa perlu install apapun, tanpa akun, dan foto kamu **tidak pernah dikirim ke internet**.

---

## Daftar isi

- [Mau pakai situsnya saja? Mulai dari sini](#mau-pakai-situsnya-saja-mulai-dari-sini)
- [Mau jalankan sendiri di komputer? Mulai dari sini](#mau-jalankan-sendiri-di-komputer-mulai-dari-sini)
  - [Langkah 1 — Install Node.js](#langkah-1--install-nodejs)
  - [Langkah 2 — Download kode ini](#langkah-2--download-kode-ini)
  - [Langkah 3 — Install dependency](#langkah-3--install-dependency)
  - [Langkah 4 — Jalankan](#langkah-4--jalankan)
- [Perintah yang tersedia](#perintah-yang-tersedia)
- [Privasi dan penyimpanan data](#privasi-dan-penyimpanan-data)
- [Semua fitur yang ada](#semua-fitur-yang-ada)
- [Bagaimana kode ini bekerja](#bagaimana-kode-ini-bekerja)
- [Peta folder dan file](#peta-folder-dan-file)
- [Cara membuat paket tema sendiri](#cara-membuat-paket-tema-sendiri)
- [Cara menambah atau mengubah bagian kode](#cara-menambah-atau-mengubah-bagian-kode)
- [Testing — cara menguji kode](#testing--cara-menguji-kode)
- [Pemecahan masalah umum](#pemecahan-masalah-umum)
- [Kontribusi](#kontribusi)
- [Lisensi font](#lisensi-font)

---

## Mau pakai situsnya saja? Mulai dari sini

> 🔗 **[photopip.vercel.app](https://photopip.vercel.app)**

Kalau sudah ada link situsnya, tinggal buka di browser — selesai. Tidak perlu install apapun.

**Cara pakainya:**

1. **Pilih tata letak** — ada 5 pilihan: strip 4 foto, strip 3 foto, grid 2×2, grid 2×3, atau satu foto besar.
2. **Ambil atau upload foto** — klik tombol kamera dan izinkan akses, atau klik tombol upload untuk pakai foto dari galeri/HP kamu.
3. **Isi semua slot** — foto diambil satu per satu. Kalau ada yang kurang bagus, klik thumbnail fotonya untuk mengambil ulang — foto lain tidak terganggu.
4. **Tekan Edit** — setelah semua slot terisi, tombol Edit akan aktif. Di sini kamu bisa:
   - Ganti **tema** tampilan (latar, bingkai, font)
   - Tambah **stiker** dan geser/ubah ukurannya di kanvas
   - Tambah **teks**
   - Ubah **filter** per foto (hitam putih, hangat, vintage, dll.)
5. **Unduh** — pilih format PNG atau JPEG, lalu klik Download.

**Beberapa hal yang perlu diketahui:**

- Kamera hanya bekerja di halaman **HTTPS** atau **`http://localhost`**. Tidak bisa di jaringan lokal biasa seperti `http://192.168.x.x`.
- Foto **hilang** kalau halaman di-refresh atau ditutup — unduh dulu sebelum meninggalkan halaman.
- Semua foto dan hiasan ada di memori browser saja, tidak pernah dikirim ke server.

---

## Mau jalankan sendiri di komputer? Mulai dari sini

Bagian ini untuk kamu yang ingin menjalankan PhotoPip di komputer sendiri, misalnya untuk belajar kodenya, mengubah sesuatu, atau sekadar ingin mencoba tanpa internet.

Ikuti langkah-langkah berikut **secara berurutan**. Jangan lewat satu pun.

---

### Langkah 1 — Install Node.js

Node.js adalah program yang dibutuhkan untuk menjalankan kode JavaScript di luar browser — termasuk dev server PhotoPip.

**Cara install:**

1. Buka [nodejs.org](https://nodejs.org)
2. Klik tombol **"LTS"** (Long Term Support) — ini versi yang paling stabil
3. Download dan jalankan installernya, ikuti langkah sampai selesai
4. Buka terminal (di Windows: cari "Command Prompt" atau "PowerShell" di menu Start)
5. Ketik perintah ini untuk memastikan instalasi berhasil:

```bash
node --version
```

Kalau muncul angka seperti `v22.11.0` atau lebih baru, Node.js sudah berhasil terinstall.

```bash
npm --version
```

npm (Node Package Manager) sudah otomatis ikut terinstall bersama Node.js. Pastikan versinya `11.x.x` atau lebih baru.

> **Belum punya terminal?**
>
> - Windows: tekan `Windows + R`, ketik `cmd`, tekan Enter
> - Mac: buka Spotlight (`Cmd + Space`), ketik "Terminal"

---

### Langkah 2 — Download kode ini

Ada dua cara:

**Cara A — Pakai Git (disarankan):**

Kalau sudah punya [Git](https://git-scm.com) terinstall, jalankan:

```bash
git clone <url-repositori-ini>
cd PhotoPip
```

**Cara B — Download ZIP:**

1. Klik tombol hijau **"Code"** di halaman GitHub ini
2. Klik **"Download ZIP"**
3. Ekstrak ZIP ke folder yang kamu inginkan
4. Buka terminal, lalu masuk ke folder hasil ekstrak:

```bash
cd path/ke/folder/PhotoPip
```

Ganti `path/ke/folder/PhotoPip` dengan lokasi folder yang sebenarnya di komputermu.

---

### Langkah 3 — Install dependency

Dependency adalah paket-paket kode buatan orang lain yang dipakai PhotoPip (seperti React, Fabric.js, dll.). Semuanya sudah didaftarkan di file `package.json` — kamu tinggal minta npm untuk mengunduh dan menyiapkannya.

Pastikan terminal kamu sudah berada di dalam folder PhotoPip, lalu jalankan:

```bash
npm install
```

Proses ini membutuhkan koneksi internet dan mungkin perlu beberapa menit. Nanti akan muncul folder baru bernama `node_modules/` — isinya semua dependency yang diunduh tadi.

> Kalau muncul pesan error soal versi Node.js, pastikan kamu sudah install versi 22 atau lebih baru (cek kembali Langkah 1).

---

### Langkah 4 — Jalankan

Setelah install selesai, jalankan dev server:

```bash
npm run dev
```

Tunggu sampai muncul pesan seperti:

```
▲ Next.js 16.4.5
- Local: http://localhost:3000
```

Buka `http://localhost:3000` di browser. PhotoPip siap dipakai.

Biarkan terminal tetap terbuka selama kamu menggunakan PhotoPip — kalau terminal ditutup, servernya berhenti.

Untuk menghentikan server, tekan `Ctrl + C` di terminal.

---

## Perintah yang tersedia

Semua perintah dijalankan dari folder utama PhotoPip.

| Perintah                   | Fungsi                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`              | Jalankan dev server di `localhost:3000` (untuk pengembangan)                             |
| `npm run build`            | Build versi produksi + kemas ke `.next/standalone/`                                      |
| `npm start`                | Jalankan server produksi (butuh `npm run build` dulu)                                    |
| `npm test`                 | Jalankan semua tes                                                                       |
| `npm run type-check`       | Periksa tipe TypeScript tanpa build                                                      |
| `npm run lint`             | Periksa kode dengan ESLint                                                               |
| `npm run format`           | Format semua file dengan Prettier                                                        |
| `npm run format:check`     | Periksa format tanpa mengubah file                                                       |
| `npm run deadcode`         | Cari file/export/dependency yang tidak terpakai                                          |
| `npm run audit:production` | Periksa celah keamanan di dependency produksi                                            |
| `npm run verify`           | **Jalankan semuanya sekaligus**: format → types → lint → test → deadcode → audit → build |

> Sebelum menganggap perubahan selesai, selalu jalankan `npm run verify`.

---

## Privasi dan penyimpanan data

PhotoPip sengaja dirancang tanpa server foto:

- **Foto tidak pernah keluar dari browser kamu.** Semua pemrosesan terjadi di dalam tab browser — tidak ada upload ke server.
- **Tidak ada database foto**, tidak ada akun, tidak ada login.
- Server hanya punya satu endpoint: `GET /api/themes` — fungsinya hanya membaca daftar folder paket tema lokal.
- Yang disimpan di browser hanya pilihan **bahasa** dan **mode gelap/terang** (lewat `localStorage`).
- Tutup atau refresh halaman → semua foto dan komposisi hilang. Memang by design.

---

## Semua fitur yang ada

### Tata letak cetak (5 pilihan)

| Nama         | Ukuran cetak | Jumlah foto | Susunan          |
| ------------ | ------------ | ----------- | ---------------- |
| Strip Klasik | 2″ × 6″      | 4 foto      | 1 kolom vertikal |
| Strip Tiga   | 2″ × 4,5″    | 3 foto      | 1 kolom vertikal |
| Grid 2×3     | 4″ × 6″      | 6 foto      | 2 kolom, 3 baris |
| Grid Persegi | 4″ × 4″      | 4 foto      | 2 kolom, 2 baris |
| Satu Foto    | 4″ × 6″      | 1 foto      | Satu foto besar  |

### Kamera

- Pakai kamera depan, resolusi ideal 1280 × 960
- **Timer** — pilih 0 (langsung), 3 detik, atau 5 detik sebelum jepret
- **Mirror** — balik gambar seperti selfie
- **Auto** — isi semua slot otomatis dengan jeda antar foto (hanya di tata letak dengan lebih dari 1 foto)
- **Retake** — ganti satu foto tanpa mengulang semuanya

**Kode error kamera yang mungkin muncul:**

| Kode          | Artinya                                                |
| ------------- | ------------------------------------------------------ |
| `denied`      | Kamu menolak izin kamera, atau browser memblokir akses |
| `missing`     | Tidak ada kamera yang terdeteksi                       |
| `busy`        | Kamera sedang dipakai aplikasi lain (Zoom, Meet, dll.) |
| `readiness`   | Stream kamera aktif tapi tidak menghasilkan gambar     |
| `capture`     | Gagal membaca frame saat jepret                        |
| `unavailable` | Error lain yang tidak dikenali                         |

### Upload foto

- Format yang bisa diupload: AVIF, BMP, GIF, HEIC, HEIF, JPG, JPEG, PNG, WebP
- Foto otomatis dikecilkan kalau lebih besar dari 2000 px di sisi terpanjang
- Latar transparan diratakan ke putih (agar kompatibel dengan semua format)

### Filter foto (6 jenis)

| Filter      | Efek                                    |
| ----------- | --------------------------------------- |
| Asli        | Tanpa perubahan                         |
| Hitam Putih | Grayscale penuh                         |
| Hangat      | Warna agak jingga/kuning                |
| Sejuk       | Warna agak biru                         |
| Vintage     | Efek foto lama                          |
| Pudar       | Saturasi berkurang, sedikit lebih cerah |

### Stiker

Ada 15 stiker bawaan: `sunglasses`, `mustache`, `crown`, `heart`, `star`, `bowtie`, `speechBubble`, `hat`, `glasses`, `wink`, `rainbow`, `peace`, `lightning`, `diamond`, `unicorn`.

Stiker bisa dicari dengan teks atau difilter per kategori (Fun, Love, Cool, Fancy). Setelah ditambahkan, bisa digeser, diubah ukuran, diputar, dibalik, dan diatur opacity-nya langsung di kanvas.

### Teks

Tambahkan tulisan ke foto dengan pilihan font: `app` (font halaman), `serif` (Georgia), `sans` (Arial), `mono` (Courier New), `display` (Impact). Bisa diatur warna, ukuran, rotasi, opacity, align, bold, dan italic.

### Undo/Redo

Tekan tombol undo/redo atau pakai shortcut keyboard. Bisa mundur sampai **40 langkah** ke belakang.

### Ekspor

- Format: **PNG** (kualitas penuh) atau **JPEG** (kualitas 95%)
- Resolusi: ukuran cetak penuh — bukan ukuran layar
- File dinamai `photopip-<timestamp>.png` atau `.jpg`

---

## Bagaimana kode ini bekerja

### Dua fase: Capture dan Edit

Aplikasi punya dua fase utama. Keduanya dikelola oleh satu komponen bernama `studio.tsx`.

```
┌──────────────────────────────────────────────────────────┐
│                     FASE 1: CAPTURE                      │
│                                                          │
│  Kamera ──→ capturePhoto() ──→ session.photos[]          │
│  Upload ──→ readPhotoFile() ──→ session.photos[]         │
│                                                          │
│  Semua slot penuh → tombol "Edit" aktif                  │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                      FASE 2: EDIT                        │
│                                                          │
│  Composition → Editor → renderComposition() → Fabric.js  │
│                                                          │
│  Setiap perubahan (tema/stiker/teks/filter) → render     │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                        EKSPOR                            │
│                                                          │
│  StaticCanvas baru → renderComposition() → toDataURL()   │
│  → download link → canvas dibuang                        │
└──────────────────────────────────────────────────────────┘
```

### Struktur data penting

**`Session`** — menyimpan state selama fase capture:

```typescript
{
  templateId: string;        // layout yang dipilih
  photos: string[];          // foto sebagai data URL JPEG
  retakeIndex: number | null; // null = tidak sedang retake
}
```

**`Composition`** — paket lengkap untuk editor dan renderer:

```typescript
{
  template: Template;            // geometri layout (ukuran slot, posisi)
  photos: string[];              // data URL foto
  themeId: string;               // ID tema aktif
  stickers: StickerPlacement[];  // posisi, ukuran, rotasi tiap stiker
  texts: TextPlacement[];        // posisi, style tiap teks
  photoFilters: PhotoFilterId[]; // filter per foto
}
```

`Composition` **tidak pernah diubah langsung** — setiap perubahan membuat objek baru. Ini mencegah bug yang sulit dilacak.

### Urutan lapisan gambar

Ketika `renderComposition()` dipanggil, lapisan digambar dari bawah ke atas:

```
8. Teks
7. Stiker
6. Logo PhotoPip (di footer bawah)
5. Artwork paket tema (PNG transparan di atas foto)
4. Garis tepi bingkai slot
3. Foto (dipotong cover-crop agar memenuhi slot)
2. Bingkai preset dari tema (opsional)
1. Latar (warna solid / gradasi / pola)
```

**Renderer yang sama** dipakai untuk pratinjau editor dan hasil ekspor. Jadi apa yang kamu lihat di editor = apa yang keluar di file unduhan.

### Alur data dalam kode

```
page.tsx
  └── Studio
        ├── useCamera()           ← akses webcam
        ├── useCaptureSession()   ← kelola session.photos[]
        │     └── sessionReducer  ← state machine foto
        ├── useThemeCatalog()     ← fetch /api/themes, merge tema
        ├── useExport()           ← handle download
        └── Editor (lazy load, SSR disabled)
              ├── useEditorCanvas()   ← Fabric canvas, resize
              ├── history.ts          ← undo/redo stack
              └── Panels: Theme, Photo, Sticker, Text, Property
```

### Bagaimana tema paket dimuat

```
GET /api/themes
  └── scanThemeDirectory()
        ├── validasi nama folder
        ├── baca theme.json (opsional)
        ├── validasi 5 PNG (ukuran piksel harus tepat)
        └── kembalikan data ke browser

Browser
  └── useThemeCatalog()
        ├── fetch /api/themes
        └── mergeThemePacks() → daftar tema di panel editor
```

---

## Tech stack

| Teknologi       | Versi  | Fungsinya di PhotoPip                                     |
| --------------- | ------ | --------------------------------------------------------- |
| **Next.js**     | 16.4.5 | Framework utama — routing, server, App Router             |
| **React**       | 19.3   | Library UI — komponen, state, rendering                   |
| **TypeScript**  | 5.9    | Bahasa yang dipakai — mencegah error tipe sebelum runtime |
| **Fabric.js**   | 7.4.0  | Canvas editor — drag, resize, rotate stiker dan teks      |
| **next-themes** | 0.4.6  | Mode gelap/terang tanpa flash saat halaman dimuat         |
| **CSS**         | —      | Satu file global `globals.css` — tidak ada Tailwind       |
| **Vitest**      | 4.1    | Test runner                                               |
| **ESLint**      | 9      | Mencegah pola kode bermasalah                             |
| **Prettier**    | 3.6    | Formatter kode dan Markdown                               |
| **Knip**        | 6      | Deteksi file dan export yang tidak terpakai               |

---

## Peta folder dan file

```
PhotoPip/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Kerangka HTML: metadata, font, ThemeProvider, LanguageProvider, Header
│   │   ├── page.tsx            ← Halaman "/" — hanya render <Studio />
│   │   ├── globals.css         ← Satu-satunya file CSS: semua variabel warna, komponen, layout, responsif
│   │   └── api/themes/
│   │       ├── route.ts        ← Endpoint GET /api/themes
│   │       └── scan.ts         ← Membaca dan memvalidasi folder theme-packs
│   │
│   ├── components/
│   │   ├── header.tsx          ← App bar: logo, pilih bahasa, toggle gelap/terang
│   │   ├── icons.tsx           ← Semua ikon SVG inline
│   │   └── theme-provider.tsx  ← Wrapper tipis di atas next-themes
│   │
│   ├── features/
│   │   ├── studio/             ← FASE 1: semua yang terjadi sebelum editor
│   │   │   ├── studio.tsx      ← Komponen utama: fase, session, layout picker
│   │   │   ├── camera/
│   │   │   │   ├── use-camera.ts       ← Hook kamera: start/stop/capture/status
│   │   │   │   └── camera-utils.ts     ← Fungsi pendukung kamera
│   │   │   ├── hooks/
│   │   │   │   ├── use-capture-session.ts  ← Countdown, flash, dispatch ke reducer
│   │   │   │   ├── use-export.ts           ← Download PNG/JPEG
│   │   │   │   └── use-theme-catalog.ts    ← Fetch dan merge tema
│   │   │   └── components/
│   │   │       ├── booth-stage.tsx      ← Area video kamera
│   │   │       ├── capture-controls.tsx ← Tombol shutter, timer, mirror, upload
│   │   │       ├── export-bar.tsx       ← Pilih format + tombol Download
│   │   │       ├── film-strip.tsx       ← Grid thumbnail foto + tombol retake
│   │   │       └── template-selector.tsx ← Pilih tata letak
│   │   │
│   │   └── editor/             ← FASE 2: editor Fabric.js
│   │       ├── editor.tsx      ← Komponen utama editor
│   │       ├── history.ts      ← Undo/redo stack (max 40 entry)
│   │       ├── hooks/
│   │       │   └── use-editor-canvas.ts  ← Inisialisasi Fabric, resize, event
│   │       └── components/
│   │           ├── theme-panel.tsx      ← Grid kartu tema
│   │           ├── photo-panel.tsx      ← Filter per foto, retake
│   │           ├── sticker-panel.tsx    ← Cari dan tambah stiker
│   │           ├── text-panel.tsx       ← Tambah dan kelola teks
│   │           ├── property-panel.tsx   ← Properti objek terpilih
│   │           ├── sticker-inspector.tsx ← Kontrol stiker: posisi, ukuran, rotasi
│   │           ├── text-inspector.tsx   ← Kontrol teks: font, warna, align
│   │           └── layer-list.tsx       ← Daftar semua layer stiker dan teks
│   │
│   ├── shared-tools/
│   │   ├── catalog/
│   │   │   ├── templates.ts    ← 5 definisi tata letak (ukuran, jumlah foto, slot)
│   │   │   ├── themes.ts       ← ThemePreset, themeById(), applyTheme()
│   │   │   ├── theme-pack.ts   ← Kontrak folder tema: parsing, validasi PNG
│   │   │   ├── theme-packs.ts  ← packToThemePreset(), mergeThemePacks()
│   │   │   ├── stickers.ts     ← 15 stiker SVG inline
│   │   │   ├── photo-filters.ts ← Definisi 6 filter
│   │   │   └── fonts.ts        ← 5 font stack + resolveTextFont()
│   │   ├── composition/
│   │   │   ├── types.ts        ← Composition, StickerPlacement, TextPlacement
│   │   │   ├── geometry.ts     ← Hitung posisi slot, crop, clamp
│   │   │   ├── render.ts       ← renderComposition() — satu renderer untuk editor dan ekspor
│   │   │   ├── export.ts       ← exportComposition() → toDataURL → download
│   │   │   └── background-fill.ts ← Latar: warna solid / gradasi / pola
│   │   ├── session.ts          ← Session type + sessionReducer
│   │   ├── image-upload.ts     ← Validasi dan resize foto upload
│   │   └── async.ts            ← delay(ms, signal) — setTimeout yang bisa di-abort
│   │
│   ├── translations/
│   │   ├── types.ts            ← Daftar bahasa, interface Messages
│   │   ├── index.ts            ← Registry semua locale
│   │   ├── use-language.tsx    ← LanguageProvider + useLanguage()
│   │   └── locales/
│   │       ├── id.ts           ← Indonesia (default)
│   │       ├── en.ts           ← English
│   │       ├── es.ts           ← Español
│   │       ├── fr.ts           ← Français
│   │       ├── de.ts           ← Deutsch
│   │       ├── ja.ts           ← 日本語
│   │       └── zh.ts           ← 中文
│   │
│   └── assets/fonts/
│       └── google-sans-flex-latin.woff2  ← Font self-hosted (tidak request ke Google)
│
├── public/
│   ├── assets/
│   │   ├── app-icons/      ← Favicon, Apple touch icon
│   │   ├── brand/logo.png  ← Logo di footer strip hasil cetakan
│   │   └── theme-packs/    ← Taruh folder tema kamu di sini
│   │       └── _starter/   ← Contoh panduan (folder _ diabaikan scanner)
│   └── manifest.json       ← Web App Manifest
│
├── tests/
│   ├── camera.test.tsx
│   ├── capture-session.test.tsx
│   ├── composition.test.ts
│   ├── editor-tabs.test.ts
│   ├── theme-catalog.test.ts
│   ├── theme-pack.test.ts
│   └── theme-preview.test.tsx
│
└── scripts/
    ├── audit-production.mjs    ← npm audit hanya untuk dependency produksi
    └── package-standalone.mjs  ← Menyalin public/ ke .next/standalone/ setelah build
```

---

## Cara membuat paket tema sendiri

Paket tema adalah folder berisi beberapa file PNG yang ditaruh di `public/assets/theme-packs/`. Saat dev server berjalan, folder ini dibaca otomatis dan tema langsung muncul di panel editor.

### 1. Buat folder tema

Buat folder baru di `public/assets/theme-packs/` dengan nama yang:

- Hanya menggunakan huruf kecil (`a-z`), angka (`0-9`), dan tanda hubung (`-`)
- Tidak diawali atau diakhiri tanda hubung
- Maksimal 40 karakter
- Tidak diawali `_` atau `.` (folder seperti itu diabaikan)

Contoh nama yang valid: `cherry-blossom`, `retro80s`, `pastel-pink`

### 2. Siapkan 5 file PNG artwork

Artwork adalah **lapisan transparan yang ditaruh di atas foto**. Bayangkan seperti bingkai foto: area transparan memperlihatkan foto di bawahnya, area berwarna menutupinya.

Setiap file harus **tepat** dimensinya — scanner akan menolak kalau ukurannya salah satu piksel pun:

| File         | Ukuran (piksel) | Untuk tata letak |
| ------------ | --------------- | ---------------- |
| `4x1.png`    | 600 × 1800      | Strip 4 foto     |
| `3x1.png`    | 600 × 1350      | Strip 3 foto     |
| `2x3.png`    | 1200 × 1800     | Grid 2×3         |
| `2x2.png`    | 1200 × 1200     | Grid 2×2         |
| `single.png` | 1200 × 1800     | Satu foto        |

> **Penting:** Nama file untuk satu foto adalah `single.png`, **bukan** `1x1.png`. Ad-blocker di browser bisa memblokir file bernama `1x1.png` karena dikira tracking pixel.

Kalau butuh tahu posisi slot foto (supaya bisa desain bingkai yang pas), buka bagian ini:

<details>
<summary>Koordinat slot foto tiap template</summary>

Format: `x, y, lebar, tinggi` (dalam piksel)

**`4x1.png` (600 × 1800):**

- Slot 1: `27, 27, 546, 407`
- Slot 2: `27, 449, 546, 407`
- Slot 3: `27, 872, 546, 407`
- Slot 4: `27, 1294, 546, 407`

**`3x1.png` (600 × 1350):**

- Slot 1: `27, 27, 546, 398`
- Slot 2: `27, 440, 546, 398`
- Slot 3: `27, 853, 546, 398`

**`2x3.png` (1200 × 1800):**

- Slot 1: `54, 54, 531, 496`
- Slot 2: `615, 54, 531, 496`
- Slot 3: `54, 580, 531, 496`
- Slot 4: `615, 580, 531, 496`
- Slot 5: `54, 1106, 531, 496`
- Slot 6: `615, 1106, 531, 496`

**`2x2.png` (1200 × 1200):**

- Slot 1: `54, 54, 531, 459`
- Slot 2: `615, 54, 531, 459`
- Slot 3: `54, 543, 531, 459`
- Slot 4: `615, 543, 531, 459`

**`single.png` (1200 × 1800):**

- Slot 1: `54, 54, 1092, 1548`

</details>

### 3. Tambahkan file opsional (kalau mau)

**`preview.png`** — gambar cover untuk kartu tema di panel editor.

- Ukuran: 64 × 64 px hingga 2048 × 2048 px
- Disarankan persegi, di bawah 1 MB

**`theme.json`** — pengaturan tema:

```json
{
  "name": "Nama Temamu",
  "textColor": "#20231f",
  "fontId": "app",
  "backgroundColor": "#ffffff"
}
```

| Field             | Default     | Keterangan                                     |
| ----------------- | ----------- | ---------------------------------------------- |
| `name`            | Nama folder | Nama tampilan, 1–60 karakter                   |
| `textColor`       | `#20231f`   | Warna teks default (`#rrggbb`)                 |
| `fontId`          | `app`       | `app`, `serif`, `sans`, `mono`, atau `display` |
| `backgroundColor` | `#ffffff`   | Warna latar solid (`#rrggbb`)                  |

### 4. Muat ulang halaman

Setelah folder selesai dibuat, muat ulang `http://localhost:3000`. Tema akan muncul otomatis di panel editor.

### Cara debug kalau tema tidak muncul

Buka `http://localhost:3000/api/themes` di browser. Response berisi dua bagian:

- `themes` — daftar tema yang berhasil dimuat
- `diagnostics` — daftar error/warning per folder

---

## Cara menambah atau mengubah bagian kode

### Menambah tata letak baru

1. Tambah entry ke `src/shared-tools/catalog/templates.ts`
2. Tambah `layoutNames` ke semua 7 locale di `src/translations/locales/`
3. Semua paket tema yang sudah ada harus ditambahkan file PNG untuk template baru
4. Update tabel di README ini

### Menambah stiker baru

1. Buat SVG inline dengan `viewBox="0 0 100 100"` — ukuran intrinsik wajib ada agar canvas bisa render
2. Tambah ke `stickerSvgs` di `src/shared-tools/catalog/stickers.ts` via `svgDataUrl()`
3. Tambah entry ke array `stickers` dengan `id`, `name`, dan `tags`

### Menambah filter baru

1. Tambah ID ke union `PhotoFilterId` di `src/shared-tools/composition/types.ts`
2. Tambah case ke `applyPhotoFilter()` di `render.ts` (efek Fabric yang sesungguhnya)
3. Tambah entry ke `photoFilters` di `src/shared-tools/catalog/photo-filters.ts`
4. Tambah key `filterNames.<id>` ke semua 7 locale

### Menambah bahasa baru

1. Tambah kode bahasa ke array `languages` di `src/translations/types.ts`
2. Buat file `src/translations/locales/<kode>.ts` yang memenuhi interface `Messages`
3. Tambah ke object `messages` di `src/translations/index.ts`
4. Tambah ke `languageNames` di `src/translations/types.ts`

### Aturan wajib saat mengubah kode

| Aturan                                                                            | Kenapa                                                                                           |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Perubahan visual wajib masuk `render.ts`                                          | Editor dan ekspor pakai renderer yang sama — kalau hanya ubah editor, hasil unduhan akan berbeda |
| Jangan mutasi `Composition` atau `Session` langsung                               | State immutable mencegah bug re-render yang sulit dilacak                                        |
| Semua string UI harus masuk ke 7 locale                                           | Hardcode teks bahasa apapun di komponen = bug i18n                                               |
| Jangan import `window`, `document`, `navigator` di kode yang bisa dirender server | Next.js merender sebagian kode di server Node.js                                                 |
| Jangan pakai `// eslint-disable` atau `@ts-ignore`                                | Perbaiki akar masalahnya, bukan sembunyikan error-nya                                            |
| Jalankan `npm run verify` sebelum selesai                                         | Satu perintah yang cek semua                                                                     |

---

## Testing — cara menguji kode

```bash
npm test                                    # jalankan semua tes
npx vitest run tests/camera.test.tsx        # jalankan satu file saja
npx vitest --watch                          # watch mode — tes ulang saat file berubah
```

Tes ada di folder `tests/`, menggunakan Vitest + Testing Library + jsdom.

| File tes                   | Yang diuji                                                 |
| -------------------------- | ---------------------------------------------------------- |
| `camera.test.tsx`          | Status kamera, penanganan error, abort, cleanup stream     |
| `capture-session.test.tsx` | `sessionReducer`: capture, retake, reset, batas slot       |
| `composition.test.ts`      | Geometri slot, cover-crop, clamp posisi stiker dan teks    |
| `editor-tabs.test.ts`      | Navigasi keyboard Arrow/Home/End di tablist editor         |
| `theme-catalog.test.ts`    | `mergeThemePacks`, hook `useThemeCatalog`                  |
| `theme-pack.test.ts`       | Validasi folder tema: ukuran PNG, format JSON, nama folder |
| `theme-preview.test.tsx`   | Render komponen `ThemePreview`                             |

> **Yang tidak dicakup tes:** hasil visual, kualitas cetak, perilaku kamera di hardware nyata.

---

## Pemecahan masalah umum

### Kamera tidak menyala

- Pastikan halaman dibuka lewat **HTTPS** atau **`http://localhost`** — tidak bisa di `http://192.168.x.x`
- Periksa izin kamera di browser (biasanya ada ikon di address bar)
- Pastikan tidak ada aplikasi lain yang sedang memakai kamera (Zoom, Meet, dll.)
- Lihat kode error yang muncul di UI dan cocokkan dengan tabel di atas

### Paket tema tidak muncul di editor

1. Buka `http://localhost:3000/api/themes` — lihat bagian `diagnostics`
2. Pastikan 5 file PNG ada dan ukurannya tepat
3. Pastikan nama folder: huruf kecil, angka, tanda hubung saja — tidak mulai dengan `_` atau `.`
4. Pastikan `theme.json` valid (cek tanda kurung, tanda kutip, koma)
5. Muat ulang halaman setelah menambah atau mengubah paket

### `npm install` gagal

- Pastikan Node.js versi 22 atau lebih baru: `node --version`
- Coba hapus folder `node_modules/` dan file `package-lock.json`, lalu jalankan `npm install` lagi
- Pastikan koneksi internet aktif

### Stiker atau teks tidak muncul di file unduhan

- Pastikan `renderComposition()` di `render.ts` sudah diperbarui — editor dan ekspor pakai fungsi yang sama
- Cek console browser untuk error gambar yang gagal dimuat

### Halaman terasa lambat atau macet di editor

- Cek console browser untuk error Fabric.js
- Pastikan kanvas editor punya ukuran lebih dari 0 (tidak tersembunyi CSS)

### Aset 404 setelah `npm run build`

- Pastikan jalankan `npm run build` dulu sebelum `npm start` — skrip build menyalin `public/` ke folder standalone
- Jangan jalankan `npm start` tanpa build sebelumnya

### Foto hilang setelah refresh

Ini memang by design — tidak ada penyimpanan permanen. Unduh foto dulu sebelum meninggalkan atau me-refresh halaman.

---

## Kontribusi

Kontribusi disambut! Ikuti langkah berikut:

1. **Fork** repositori ini di GitHub
2. **Buat branch** untuk perubahan kamu: `git checkout -b fitur/nama-fitur`
3. **Buat perubahan** — ikuti aturan pengembangan di atas
4. **Jalankan gate:** `npm run verify` harus lolos penuh tanpa error
5. **Commit** dengan pesan yang jelas tentang apa yang berubah
6. **Buat Pull Request** — deskripsikan apa yang berubah dan kenapa

**Yang perlu diingat saat PR:**

- Semua string UI baru harus ada di **7 locale**
- Perubahan visual harus mengubah `render.ts`, bukan hanya komponen editor
- Jangan tambahkan dependency baru tanpa diskusi dulu
- Satu PR satu tujuan — lebih mudah di-review

---

## Lisensi font

Font **Google Sans Flex** digunakan dengan lisensi [SIL Open Font License (OFL)](https://scripts.sil.org/OFL). File lisensi ada di `src/assets/fonts/`. Pertahankan file lisensi saat mendistribusikan ulang.
