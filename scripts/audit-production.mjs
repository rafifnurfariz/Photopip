// script buat ngecek celah keamanan package production lewat npm audit
// dipanggil pas npm run audit:production atau npm run verify
import { spawnSync } from "node:child_process";

// jalanin npm audit khusus dependency production aja
const result = spawnSync("npm audit --omit=dev", {
  stdio: "inherit",
  shell: true,
  // kosongin flag allow_scripts biar tidak bentrok pas audit jalan
  env: { ...process.env, npm_config_allow_scripts: "" },
});

// kalau gagal ngejalanin perintahnya, tampilkan pesan error dan keluar
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

// teruskan kode exit dari npm audit ke terminal
process.exit(result.status ?? 1);
