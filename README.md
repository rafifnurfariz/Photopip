<div align="center">
  <img src="public/assets/brand/logo.png" alt="Logo PhotoPip" width="112" />
  <h1>PhotoPip</h1>
  <p>
    Aplikasi web photobooth dan editor foto interaktif berbasis Next.js dan Fabric.js dengan dukungan beragam frame custom, stiker custom, font kustom, serta 7 pilihan bahasa
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.4.5-0a0a0a?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.3.0-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Fabric.js-7.4.0-FF6B6B?style=flat-square" alt="Fabric.js" />
    <img src="https://img.shields.io/badge/Sharp-0.35.5-99CC00?style=flat-square" alt="Sharp" />
    <img src="https://img.shields.io/badge/Node.js-%3E%3D22.0.0-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  </p>

  <p>
    <a href="https://photopip.vercel.app/"><b>Buka Website</b></a>
    &nbsp;&middot;&nbsp;
    <a href="https://github.com/rafifnurfariz/Photopip"><b>Repositori GitHub</b></a>
    &nbsp;&middot;&nbsp;
    <a href="#cara-pakai--tambah-aset-sendiri"><b>Cara Pakai</b></a>
    &nbsp;&middot;&nbsp;
    <a href="#cara-install-dan-menjalankan"><b>Cara Jalankan</b></a>
  </p>
</div>

---

## Fitur Utama

| Fitur                | Penjelasan Singkat                                                                                                                                                                                                                                                      |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Photo booth**      | Ambil foto langsung lewat kamera browser, ada hitung mundur (`0`, `3`, atau `5` detik), mode cermin, foto beruntun otomatis, sama pratinjau kotak foto. Bisa juga unggah foto dari galeri.                                                                              |
| **Tata letak**       | Ada 5 pilihan susunan foto: foto tunggal (`1x1`), grid `2x2`, grid `2x3`, strip `3x1`, dan strip `4x1`.                                                                                                                                                                 |
| **Bingkai bawaan**   | Sudah tersedia 9 paket bingkai: `default`, `cyber-glow`, `gta-6`, `matcha-latte`, `minecraft`, `monochrome-noir`, `pastel-party`, `retro-night`, dan `sunset-vibes`.                                                                                                    |
| **Editor canvas**    | Pakai Fabric.js jadi stiker dan teks bisa digeser, diputar, diubah ukurannya langsung di atas strip. Ada undo/redo, daftar layer, 6 filter foto, stiker per kategori (`cute`, `emoji`, `food`, `nature`, `y2k`), unggah stiker sendiri, plus pilih font dan warna teks. |
| **Scan otomatis**    | Cukup taruh file bingkai, stiker, atau font ke folder `public/assets/`, nanti endpoint `/api/frames`, `/api/stickers`, dan `/api/fonts` langsung ngebaca otomatis tanpa perlu ubah kode.                                                                                |
| **7 bahasa & tema**  | Mendukung bahasa Indonesia (`id`), Inggris (`en`), Jerman (`de`), Spanyol (`es`), Prancis (`fr`), Jepang (`ja`), dan Mandarin (`zh`), plus mode terang dan gelap.                                                                                                       |
| **Siap unduh & PWA** | Sudah ada `manifest.json` dan ikon aplikasi, dan hasil akhirnya bisa langsung diunduh dalam format `PNG` atau `JPEG`.                                                                                                                                                   |

---

## Teknologi yang Dipakai

### Aplikasi Utama

| Teknologi                   | Versi                 | Peran di Proyek                                                                                                                                                        |
| :-------------------------- | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js & React**         | `^16.4.5` / `^19.3.0` | Kerangka utama website, routing halaman (`src/app/`), dan 3 API pembaca aset (`/api/frames`, `/api/stickers`, `/api/fonts`).                                           |
| **TypeScript**              | `5.9.3`               | Bahasa utama biar tipe data antar file jelas dan rapi.                                                                                                                 |
| **Fabric.js**               | `7.4.0`               | Library canvas di halaman editor buat narik, muter, ngecilin/nggedein stiker sama teks, dan nge-render hasil akhir ke PNG/JPEG.                                        |
| **Sharp**                   | `0.35.5`              | Dipakai di sisi server (`src/shared-tools/catalog/frame-pack.ts`) buat baca file PNG bingkai dan ngambil warna dominan buat latar strip dan warna teks bawaan bingkai. |
| **next-themes & CSS Murni** | `0.4.6`               | Ngatur ganti tema terang/gelap dan seluruh tampilan website lewat satu file `src/app/globals.css` (tanpa Tailwind).                                                    |
| **API Bawaan Browser**      | —                     | `MediaDevices.getUserMedia` buat akses kamera, Canvas 2D API buat jepret dan resize foto upload, serta `FontFace` API buat muat file font `.ttf` secara dinamis.       |

### Pengujian & Cek Kualitas Kode

| Alat                               | Versi                          | Kegunaan                                                                                                                                       |
| :--------------------------------- | :----------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest, Testing Library, jsdom** | `4.1.11` / `16.3.0` / `27.0.1` | Buat jalanin unit test dan simulasi komponen/DOM tanpa buka browser.                                                                           |
| **ESLint**                         | `9.39.5`                       | Ngecek aturan kode pakai `typescript-eslint` (`8.71.2`), `eslint-plugin-react-hooks` (`7.1.1`), dan `eslint-plugin-unused-imports` (`^4.4.1`). |
| **Prettier**                       | `3.6.2`                        | Merapikan format penulisan kode secara otomatis.                                                                                               |
| **Knip**                           | `^6.45.0`                      | Mencari file, dependensi, atau export yang tidak kepakai lagi.                                                                                 |

---

## Privasi & Keamanan

> ![Privasi](https://img.shields.io/badge/PRIVASI-100%25_DI_BROWSER-2563eb?style=flat-square)
>
> Semua urusan olah foto kejadiannya **100% di browser kamu sendiri**, mulai dari kamera, filter, stiker, sampai unduh `PNG`/`JPEG`. Foto gak pernah dikirim ke server.

Server cuma baca daftar file bingkai, stiker, dan font yang ada di `public/assets/`. Di `next.config.mjs` juga sudah dipasang aturan keamanan CSP (`default-src 'self'`, `img-src 'self' data: blob:`, `font-src 'self'`, `script-src 'self' 'unsafe-inline'`, `connect-src 'self'`) dan `Permissions-Policy` yang cuma ngebolehin kamera (`camera=(self)`), tanpa script pelacak dari luar.

---

## Yang Perlu Disiapkan

- **Node.js** versi `>= 22.0.0`
- **Browser modern** yang mendukung kamera (`MediaDevices.getUserMedia`)

> ![Penting](https://img.shields.io/badge/PENTING-SYARAT_KAMERA-d97706?style=flat-square)
>
> Browser cuma ngizinin kamera di `localhost` atau lewat `HTTPS`. Kalau buka dari HP lewat IP lokal (`http://192.168.x.x:3000`), izin kamera bakal ditolak browser. Kalau mau tes di HP, pakai tunnel HTTPS.

---

## Cara Install dan Menjalankan

1. **Download atau clone repositori:**

   ```bash
   git clone https://github.com/rafifnurfariz/Photopip.git
   cd Photopip
   ```

2. **Install semua paket yang dibutuhkan:**

   ```bash
   npm install
   ```

3. **Jalankan server development:**

   ```bash
   npm run dev
   ```

4. **Buka di browser:** masuk ke **`http://localhost:3000`**.

5. **Kalau mau tes dan bikin build produksi:**

   ```bash
   # Jalanin semua tes Vitest
   npm test

   # Bikin build produksi lalu jalankan server-nya
   npm run build
   npm start
   ```

---

## Daftar Perintah npm

| Perintah                              | Kegunaan                                                                               |
| :------------------------------------ | :------------------------------------------------------------------------------------- |
| `npm run dev`                         | Nyalain server lokal buat ngoding. |
| `npm run build`                       | Bikin build produksi, lalu nyalin folder `public/` dan `.next/static` ke standalone.   |
| `npm start`                           | Jalanin hasil build produksi dari `.next/standalone/server.js`.                        |
| `npm test`                            | Jalanin semua tes Vitest sekali jalan.                                                 |
| `npx vitest run tests/<file>.test.ts` | Jalanin satu file tes aja.                                                             |
| `npx vitest`                          | Jalanin tes dalam mode watch (otomatis tes ulang kalau file disimpan).                 |
| `npm run lint`                        | Cek error/warning ESLint (gagal kalau ada 1 warning pun).                              |
| `npm run type-check`                  | Cek error tipe TypeScript pakai `tsc --noEmit`.                                        |
| `npm run format` / `format:check`     | Rapihin kode pakai Prettier (`format`), atau cuma ngecek aja (`format:check`).         |
| `npm run deadcode`                    | Cek kode/file nganggur pakai Knip.                                                     |
| `npm run audit:production`            | Cek celah keamanan paket produksi pakai `npm audit --omit=dev`.                        |
| `npm run verify`                      | Jalanin semua cek sekaligus: format, tipe, lint, test, deadcode, audit, sampai build.  |

> ![Tips](https://img.shields.io/badge/TIPS-SEBELUM_COMMIT-16a34a?style=flat-square)
>
> Biasakan jalanin `npm run verify` sebelum commit biar kode tetap aman.

---

## Struktur Folder

<details>
<summary><b>Lihat susunan lengkap folder dan file proyek</b></summary>

```text
Photopip/
├── public/
│   ├── assets/
│   │   ├── app-icons/       # Favicon & ikon aplikasi (16x16 sampai 512x512)
│   │   ├── brand/           # Logo resmi PhotoPip (logo.png)
│   │   ├── fonts/           # Font .ttf tambahan yang dibaca /api/fonts
│   │   ├── frame-packs/     # Satu folder per bingkai; _starter/ itu contoh kosongan
│   │   └── stickers/        # Gambar stiker per folder kategori
│   └── manifest.json        # Pengaturan Web App Manifest
├── scripts/                 # Skrip bantu build & cek (sync-frame-dates, package-standalone, audit-production)
├── src/
│   ├── app/
│   │   ├── api/             # Endpoint API pemindai aset (frames, stickers, fonts)
│   │   ├── globals.css      # Satu-satunya file CSS buat seluruh tampilan
│   │   ├── layout.tsx       # Kerangka HTML utama, font bawaan, metadata
│   │   └── page.tsx         # Halaman utama website
│   ├── assets/fonts/        # Font UI bawaan (Segoe UI) lewat next/font/local
│   ├── components/          # Komponen global (header, icons, theme-provider)
│   ├── features/
│   │   ├── editor/          # Fase 2: canvas Fabric.js, panel bingkai/foto/stiker/teks/properti, history
│   │   └── studio/          # Fase 1: kamera, sesi ambil foto, film strip, pilih tata letak
│   ├── shared-tools/
│   │   ├── catalog/         # Data template, filter foto, font, frame pack, frame-dates.json
│   │   ├── composition/     # Rumus ukuran, renderer Fabric.js, ekspor PNG/JPEG
│   │   └── *.ts             # Helper umum (session, image-upload, async, id)
│   └── translations/        # Pengaturan bahasa + file kamus 7 bahasa
├── tests/                   # Kumpulan tes Vitest (satu file per fitur)
├── eslint.config.mjs        # Aturan ESLint 9
├── next.config.mjs          # Pengaturan Next.js & header keamanan
├── package.json             # Daftar library & perintah npm
├── tsconfig.json            # Pengaturan TypeScript
└── vitest.config.mts        # Pengaturan Vitest (jsdom)
```

</details>

---

## Cara Pakai & Tambah Aset Sendiri

### 1. Cara Pakai Photo Booth dan Editor

1. Buka `http://localhost:3000`.
2. Di sebelah kanan, pilih **Tata letak** yang kamu mau (misalnya `Strip klasik` atau `Grid persegi`).
3. Klik **Nyalakan kamera** lalu izinkan akses kamera di browser (kalau gak ada kamera, klik **Unggah foto** buat pilih gambar dari perangkat).
4. Atur hitung mundur atau cermin kalau perlu, lalu klik **Ambil foto** sampai semua kotak foto terisi. Kamu bisa klik ikon putar di foto kalau mau ambil ulang slot tertentu.
5. Kalau sudah penuh, klik **Edit strip foto** buat masuk ke halaman Editor.
6. Di Editor, pilih **Bingkai**, kasih **Filter foto**, tempel **Stiker**, atau tambah **Teks** sesuai selera.
7. Terakhir, pilih format file (**PNG** atau **JPEG**) di bar bawah lalu klik **Unduh strip**.

### 2. Cara Nambah Bingkai (Frame Pack) Baru

Scanner di `src/app/api/frames/scan.ts` punya aturan ukuran yang wajib persis:

1. Duplikat folder `public/assets/frame-packs/_starter/` (jangan duplikat `default/`) lalu kasih nama baru, misalnya:
   ```text
   public/assets/frame-packs/vintage-film/
   ```
   Nama folder bakal jadi nama bingkainya. Folder yang depannya pakai tanda `_` (kayak `_starter`) otomatis dilewati scanner.
2. Ganti 5 file PNG di dalamnya. Ukuran pikselnya harus **sama persis** kayak tabel ini, kalau meleset sedikit aja paket bingkainya bakal ditolak:

   | Nama File    | Ukuran Piksel |
   | :----------- | :------------ |
   | `single.png` | `1200 × 1800` |
   | `2x2.png`    | `1200 × 1200` |
   | `2x3.png`    | `1200 × 1800` |
   | `3x1.png`    | `600 × 1350`  |
   | `4x1.png`    | `600 × 1800`  |

3. Pastikan area kotak fotonya transparan karena gambar bingkai ditumpuk di atas foto. Bagian paling bawah (`12%` tinggi canvas) juga disiapin buat logo PhotoPip.
4. Gak perlu bikin file `frame.json`. Warna latar strip diambil otomatis dari warna paling dominan di `single.png`, dan warna default buat teks yang ditambahin user juga otomatis dipilih gelap atau putih biar tetap kebaca.
5. Refresh halaman website, nanti bingkai barunya langsung muncul di tab **Bingkai**. Kalau ada yang salah ukuran atau kurang file, alasannya bisa dilihat di log terminal pas `npm run dev`.

> ![Info](https://img.shields.io/badge/INFO-RUMUS_POSISI_SLOT-2563eb?style=flat-square)
>
> Kalau mau lihat rumus posisi kotak fotonya, cek `src/shared-tools/composition/geometry.ts`.

### 3. Cara Nambah Stiker Baru

1. Buka `public/assets/stickers/`, lalu pilih salah satu kategori yang sudah ada (`cute/`, `emoji/`, `food/`, `nature/`, atau `y2k/`), atau bikin folder kategori baru di situ:
   ```text
   public/assets/stickers/cute/
   ```
2. Taruh gambar stikernya (paling bagus pakai PNG transparan, misal `star_sparkle.png`). Format yang didukung: `.png`, `.webp`, `.jpg`, dan `.jpeg`.
3. Refresh halaman, stiker barunya langsung muncul di tab **Stiker**. Nama stikernya diambil otomatis dari nama file (`star_sparkle` jadi "Star Sparkle"). Kalau file ditaruh langsung di luar folder kategori (`public/assets/stickers/`), stikernya masuk ke tab **Semua**.

### 4. Cara Nambah Font Baru

1. Taruh file font berformat `.ttf` langsung di dalam folder ini (jangan di dalam subfolder):
   ```text
   public/assets/fonts/
   ```
   _(Contoh: `public/assets/fonts/Poppins-Bold.ttf`)_
2. Refresh halaman, font barunya langsung muncul di pilihan **Font** pas kamu ngedit teks. Font bawaan website (`Segoe UI`) disimpannya di `src/assets/fonts/` lewat `next/font/local`, jadi gak perlu ditaruh di sini.

---

<div align="center">
  <sub>Dibuat untuk PhotoPip &middot; <a href="#photopip">Kembali ke atas</a></sub>
</div>
