import localFont from "next/font/local";
import AppShell from "../components/AppShell";
import { YumusakKaydirma } from "../components/Hareket";
import "./globals.css";

// Satoshi (Fontshare, ITF Free Font License)
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata = {
  title: "YükHaritası - Türkiye'nin Lojistik Platformu",
  description: "Türkiye genelinde yük sahiplerini ve nakliyecileri buluşturur.",
  appleWebApp: { capable: true, title: "YükHaritası", statusBarStyle: "black-translucent" },
};

export const viewport = {
  themeColor: "#1e3a5f",
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={satoshi.variable}>
      <body className="font-sans antialiased">
        <YumusakKaydirma />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
