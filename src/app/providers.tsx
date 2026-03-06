"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { AppAlertProvider } from "~/components/ui/app-alert";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppAlertProvider>
          {children}
        </AppAlertProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
