import { Geist } from "next/font/google";
import AppShell from "../components/AppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
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
    <html lang="tr" className={geistSans.variable}>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
