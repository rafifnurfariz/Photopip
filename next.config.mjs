// konfigurasi utama Next.js buat PhotoPip
// ngatur mode build standalone, kebijakan gambar, sama header keamanan HTTP

/** @type {import('next').NextConfig} */
// cek lagi jalan di mode development atau bukan
const isDev = process.env.NODE_ENV === "development";

// susun aturan Content Security Policy biar browser cuma muat aset dari sumber yang aman
const contentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// opsi config Next.js yang bakal dibaca pas dev dan build
const nextConfig = {
  // izinkan akses dev server dari IP lokal biar bisa dites di HP
  allowedDevOrigins: ["192.168.100.195"],
  // hasil build dibikin standalone biar gampang di-deploy
  output: "standalone",
  // sembunyiin header X-Powered-By Next.js
  poweredByHeader: false,
  // matiin image optimizer bawaan karena gambar diproses langsung di browser
  images: { unoptimized: true },
  // tambahin header keamanan di semua route website
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // izinkan kamera cuma di origin sendiri, blokir mic dan lokasi
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
};
export default nextConfig;
