import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { TelegramWebAppProvider } from "@/components/telegram-webapp-provider";
import { CartProvider } from "@/components/cart-context";
import Script from "next/script";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

const body = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Noir Atelier - Perfume House",
  description: "Premium perfume boutique mini app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramWebAppProvider>
          <CartProvider>{children}</CartProvider>
        </TelegramWebAppProvider>
      </body>
    </html>
  );
}
