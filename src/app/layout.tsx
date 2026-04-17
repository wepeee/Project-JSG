import "~/styles/globals.css";
import { Providers } from "./providers";
import { auth } from "~/server/auth";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Project JSG",
  description: "Sistem monitoring produksi Project JSG",
  icons: [{ rel: "icon", url: "/jsg.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable}`}>
      <body suppressHydrationWarning>
        <TRPCReactProvider>
          <Providers session={session}>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
