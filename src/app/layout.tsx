import { headers } from "next/headers";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://cognisignal.example"),
  title: { default: "CogniSignal | Personal cognitive tracking", template: "%s | CogniSignal" },
  description: "Observe changes in your performance over time against your own personal baseline. CogniSignal is not a diagnostic tool.",
  openGraph: { type: "website", siteName: "CogniSignal", title: "CogniSignal | Personal cognitive tracking", description: "A non-diagnostic personal tracking signal." }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-next-intl-locale") ?? "es";
  return <html lang={locale}><body>{children}</body></html>;
}
