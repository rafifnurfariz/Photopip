<div align="center">
  <img src="public/assets/brand/logo.png" alt="Photopip Logo" width="140" />

  <h1>Photopip</h1>

  <p>
    <strong>Aplikasi Web Photobooth & Editor Foto Interaktif Berbasis Next.js</strong>
  </p>

  <p>
    Ambil rangkaian foto langsung dari kamera, pilih <em>frame pack</em> tematik, hias dengan stiker &amp; teks kustom, lalu ekspor hasil komposisi dalam hitungan detik.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vitest-Tested-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
    <img src="https://img.shields.io/badge/License-MIT-F7DF1E?style=for-the-badge" alt="MIT License" />
  </p>

  <p>
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-teknologi-yang-digunakan">Teknologi</a> •
    <a href="#-instalasi--menjalankan-proyek">Instalasi</a> •
    <a href="#-susunan-project">Susunan Project</a> •
    <a href="#-contoh-penggunaan">Penggunaan</a> •
    <a href="#-kontribusi">Kontribusi</a>
  </p>
</div>

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
| :--- | :--- |
| 📸 **Studio Photobooth Interaktif** | Pengambilan foto langsung via kamera perangkat (`use-camera`, `booth-stage`) lengkap dengan hitung mundur, *film strip* pratinjau, serta opsi unggah foto dari galeri. |
| 🖼️ **Layout & Frame Pack Tematik** | Mendukung format `single`, `2x2`, `2x3`, `3x1`, dan `4x1` dengan tema bawaan: `default`, `cyber-glow`, `gta-6`, `matcha-latte`, `minecraft`, `monochrome-noir`, `pastel-party`, `retro-night`, dan `sunset-vibes`. |
| 🎨 **Editor Foto & Manajemen Layer** | Kanvas interaktif dengan riwayat *Undo/Redo*, pengaturan urutan layer (`layer-list`), filter foto (`photo-filters`), stiker (`cute`, `emoji`, `food`, `nature`, `y2k`), dan kustomisasi teks/font. |
| ⚡ **Auto-Discovery Asset API** | Endpoint `/api/frames`, `/api/stickers`, dan `/api/fonts` memindai aset di folder `public/assets/` secara otomatis tanpa perlu mengubah kode inti. |
| 🌐 **Dukungan Multi-Bahasa (7 Bahasa)** | Antarmuka tersedia dalam bahasa **Indonesia (`id`)**, **Inggris (`en`)**, **Jerman (`de`)**, **Spanyol (`es`)**, **Prancis (`fr`)**, **Jepang (`ja`)**, dan **Mandarin (`zh`)**. |
| 📱 **PWA Ready & Ekspor Instan** | Dilengkapi `manifest.json` dan ikon aplikasi lengkap agar dapat dipasang layaknya aplikasi native, serta rendering komposisi resolusi penuh via HTML5 Canvas. |

---

## 🛠️ Teknologi yang Digunakan

* **Framework:** [Next.js](https://nextjs.org/) (App Router & API Routes)
* **Bahasa & UI:** [TypeScript](https://www.typescriptlang.org/) & [React](https://react.dev/)
* **Styling:** CSS Modules & Global CSS (`src/app/globals.css`)
* **Rendering Engine:** HTML5 Canvas API (`src/shared-tools/composition/`)
* **Testing & Linting:** [Vitest](https://vitest.dev/) & ESLint

---

## 📋 Prasyarat Instalasi

Sebelum menjalankan proyek secara lokal, pastikan lingkungan pengembangan Anda memenuhi syarat berikut:

* **Node.js** versi `18.18` atau lebih baru *(disarankan LTS `20.x`)*
* **npm** *(atau package manager kompatibel seperti `pnpm` / `yarn`)*
* Browser modern dengan dukungan akses kamera (`MediaDevices.getUserMedia`)

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

3. **Jalankan server pengembangan (*development*):**
   ```bash
   npm run dev
   ```

4. **Buka di browser:**
   Kunjungi **`http://localhost:3000`** untuk mulai menggunakan Photopip.

5. **Menjalankan pengujian & build produksi:**
   ```bash
   # Menjalankan unit & component test dengan Vitest
   npm test

   # Membuat build produksi
   npm run build
   npm start
   ```

---

## 📂 Susunan Project

```text
Photopip/
├── public/
│   ├── assets/
│   │   ├── app-icons/       # Favicon & ikon PWA (16x16 hingga 512x512)
│   │   ├── brand/           # Logo resmi aplikasi (logo.png)
│   │   ├── fonts/           # Font publik untuk rendering kanvas
│   │   ├── frame-packs/     # Koleksi bingkai (2x2, 2x3, 3x1, 4x1, single)
│   │   └── stickers/        # Koleksi stiker (cute, emoji, food, nature, y2k)
│   └── manifest.json        # Konfigurasi Web App Manifest
├── scripts/                 # Skrip audit produksi, packaging, & sinkronisasi frame
├── src/
│   ├── app/
│   │   ├── api/             # API routes pemindai aset (fonts, frames, stickers)
│   │   ├── globals.css      # Styling global
│   │   ├── layout.tsx       # Root layout aplikasi
│   │   └── page.tsx         # Halaman utama
│   ├── components/          # Komponen UI umum (header, icons, theme-provider)
│   ├── features/
│   │   ├── editor/          # Kanvas editor, panel properti, layer, stiker, teks
│   │   └── studio/          # Kamera, sesi capture, film strip, & kontrol ekspor
│   ├── shared-tools/
│   │   ├── catalog/         # Definisi template, filter foto, & parser frame pack
│   │   └── composition/     # Mesin render komposisi, geometri, & ekspor gambar
│   └── translations/        # File lokalisasi 7 bahasa & hook use-language
├── tests/                   # Suite pengujian otomatis berbasis Vitest
├── TUTORIAL.md              # Panduan penggunaan & kustomisasi lanjutan
├── next.config.mjs          # Konfigurasi Next.js
├── package.json             # Daftar dependensi & skrip npm
└── tsconfig.json            # Konfigurasi TypeScript
```

---

## 💡 Contoh Penggunaan

### 1. Sesi Photobooth & Editing Dasar
1. Buka `http://localhost:3000` dan izinkan akses kamera pada browser.
2. Pilih **Layout Template** (misalnya `4x1` atau `2x2`) dan **Frame Pack** favorit Anda (contoh: `cyber-glow` atau `matcha-latte`).
3. Tekan tombol **Capture** untuk memulai sesi pengambilan foto beruntun.
4. Masuk ke mode **Editor** untuk menambahkan filter foto, menempelkan stiker dari panel stiker, atau menulis teks kustom.
5. Klik **Export / Download** untuk mengunduh hasil foto akhir ke perangkat Anda.

### 2. Menambahkan Frame Pack Kustom
<details>
<summary><strong>Klik untuk melihat langkah menambah frame pack tanpa mengubah kode</strong></summary>
<br />

1. Salin folder template `public/assets/frame-packs/_starter` dan beri nama sesuai tema baru, misalnya:
   ```text
   public/assets/frame-packs/vintage-film/
   ```
2. Ganti berkas gambar di dalamnya sesuai dimensi layout masing-masing:
   * `single.png`
   * `2x2.png`
   * `2x3.png`
   * `3x1.png`
   * `4x1.png`
3. Muat ulang halaman aplikasi—endpoint `/api/frames` akan otomatis mendeteksi dan menampilkan *frame pack* baru Anda di katalog studio.

</details>

---

## 🤝 Kontribusi

Kontribusi sangat diterima untuk mengembangkan **Photopip**, baik berupa penambahan *frame pack*, stiker baru, terjemahan bahasa, maupun perbaikan *bug*:

1. **Fork** repositori ini.
2. Buat *branch* fitur baru:
   ```bash
   git checkout -b fitur/nama-fitur
   ```
3. Lakukan perubahan dan pastikan semua tes lulus:
   ```bash
   npm test
   ```
4. **Commit** perubahan Anda:
   ```bash
   git commit -m "feat: menambahkan fitur ..."
   ```
5. **Push** ke *branch* Anda:
   ```bash
   git push origin fitur/nama-fitur
   ```
6. Buka **Pull Request** dengan penjelasan perubahan yang jelas.

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi **MIT**.

```text
MIT License

Copyright (c) 2026 rafifnurfariz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```