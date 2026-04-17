"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { AppAlertProvider } from "~/components/ui/app-alert";
import { NavigationProgressBar } from "~/components/navigation-progress-bar";

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
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AppAlertProvider>
          <NavigationProgressBar />
          {children}
        </AppAlertProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
