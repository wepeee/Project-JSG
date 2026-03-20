"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { Moon, Sun, Monitor, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function SettingsTab() {
  const { setTheme, theme } = useTheme();
  const { data: session } = useSession();

  return (
    <div className="bg-background min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-background/80 sticky top-0 z-30 border-b pt-5 shadow-sm backdrop-blur-xl">
        <div className="px-5 pb-4">
          <h1 className="from-brand-teal to-brand-pink bg-gradient-to-r bg-clip-text text-2xl font-black tracking-tight text-transparent">
            Pengaturan
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-6">
        {/* Profile Card */}
        <Card className="bg-card ring-border border-none shadow-lg ring-1 shadow-black/5">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            {/* <Avatar className="border-primary h-12 w-12 border-2">
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-black">
                {(session?.user?.name ?? "OP").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar> */}
            <div className="flex flex-col">
              <CardTitle className="text-lg font-black">
                {session?.user?.name}
              </CardTitle>
              <CardDescription className="text-xs font-medium tracking-wider uppercase">
                {session?.user?.role ?? "Operator"}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Theme Settings */}
        <div className="space-y-3">
          <h3 className="text-muted-foreground px-1 text-xs font-bold tracking-widest uppercase">
            Tampilan & Tema
          </h3>
          <Card className="bg-card ring-border border-none shadow-lg ring-1 shadow-black/5">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className={`flex h-24 flex-col gap-2 border-2 ${
                    theme === "light"
                      ? "border-primary bg-primary/5 text-primary"
                      : "bg-muted/50 hover:bg-muted border-transparent"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-6 w-6" />
                  <span className="text-[10px] font-bold">Terang</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex h-24 flex-col gap-2 border-2 ${
                    theme === "dark"
                      ? "border-primary bg-primary/5 text-primary"
                      : "bg-muted/50 hover:bg-muted border-transparent"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-6 w-6" />
                  <span className="text-[10px] font-bold">Gelap</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex h-24 flex-col gap-2 border-2 ${
                    theme === "system"
                      ? "border-primary bg-primary/5 text-primary"
                      : "bg-muted/50 hover:bg-muted border-transparent"
                  }`}
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-6 w-6" />
                  <span className="text-[10px] font-bold">Sistem</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <h3 className="text-muted-foreground px-1 text-xs font-bold tracking-widest uppercase">
            Akun
          </h3>
          <Button
            variant="destructive"
            className="bg-destructive text-destructive-foreground shadow-destructive/20 hover:bg-destructive/90 h-12 w-full justify-start gap-3 rounded-xl shadow-lg"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-bold">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
