"use client";

// pembungkus ThemeProvider dari next-themes buat dipakai di RootLayout
// dipisah jadi client component karena next-themes butuh jalan di browser
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
