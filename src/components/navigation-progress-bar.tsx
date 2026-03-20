"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

const MIN_VISIBLE_MS = 280;
const COMPLETE_DELAY_MS = 180;
const TRICKLE_INTERVAL_MS = 120;
const MAX_PENDING_MS = 6000;

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const activeRef = React.useRef(false);
  const startedAtRef = React.useRef(0);
  const trickleTimerRef = React.useRef<number | null>(null);
  const finishTimerRef = React.useRef<number | null>(null);
  const hideTimerRef = React.useRef<number | null>(null);
  const forceFinishTimerRef = React.useRef<number | null>(null);
  const startRafRef = React.useRef<number | null>(null);
  const pendingStartRef = React.useRef(false);

  const clearTimers = React.useCallback(() => {
    if (trickleTimerRef.current !== null) {
      window.clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (forceFinishTimerRef.current !== null) {
      window.clearTimeout(forceFinishTimerRef.current);
      forceFinishTimerRef.current = null;
    }
  }, []);

  const isDifferentPathSearch = React.useCallback((nextUrl: URL) => {
    const next = `${nextUrl.pathname}${nextUrl.search}`;
    const current = `${window.location.pathname}${window.location.search}`;
    return next !== current;
  }, []);

  const startNow = React.useCallback(() => {
    clearTimers();

    if (!activeRef.current) {
      activeRef.current = true;
      startedAtRef.current = Date.now();
      setVisible(true);
      setProgress(12);
    } else {
      setProgress((current) => (current < 12 ? 12 : current));
    }

    trickleTimerRef.current = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 94) return current;
        const delta = Math.max((95 - current) * 0.08, 0.35);
        return Math.min(current + delta, 94);
      });
    }, TRICKLE_INTERVAL_MS);

    // Failsafe: prevent bar from being stuck forever
    forceFinishTimerRef.current = window.setTimeout(() => {
      setProgress(100);
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
        activeRef.current = false;
      }, COMPLETE_DELAY_MS);
    }, MAX_PENDING_MS);
  }, [clearTimers]);

  const scheduleStart = React.useCallback(() => {
    pendingStartRef.current = true;
    if (startRafRef.current !== null) return;

    startRafRef.current = window.requestAnimationFrame(() => {
      startRafRef.current = null;
      if (!pendingStartRef.current) return;
      pendingStartRef.current = false;
      startNow();
    });
  }, [startNow]);

  const finish = React.useCallback(() => {
    if (!activeRef.current) return;

    if (forceFinishTimerRef.current !== null) {
      window.clearTimeout(forceFinishTimerRef.current);
      forceFinishTimerRef.current = null;
    }

    const elapsed = Date.now() - startedAtRef.current;
    const waitMs = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    if (trickleTimerRef.current !== null) {
      window.clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }

    finishTimerRef.current = window.setTimeout(() => {
      setProgress(100);
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
        activeRef.current = false;
      }, COMPLETE_DELAY_MS);
    }, waitMs);
  }, []);

  React.useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;
      if (!isDifferentPathSearch(nextUrl)) return;

      scheduleStart();
    };

    const onPopState = () => {
      scheduleStart();
    };

    const historyRef = window.history;
    const originalPushState = historyRef.pushState.bind(historyRef);
    const originalReplaceState = historyRef.replaceState.bind(historyRef);

    historyRef.pushState = (...args: Parameters<History["pushState"]>) => {
      const nextUrlArg = args[2];
      if (nextUrlArg) {
        const nextUrl = new URL(String(nextUrlArg), window.location.href);
        if (isDifferentPathSearch(nextUrl)) {
          scheduleStart();
        }
      }
      return originalPushState(...args);
    };

    historyRef.replaceState = (...args: Parameters<History["replaceState"]>) => {
      const nextUrlArg = args[2];
      if (nextUrlArg) {
        const nextUrl = new URL(String(nextUrlArg), window.location.href);
        if (isDifferentPathSearch(nextUrl)) {
          scheduleStart();
        }
      }
      return originalReplaceState(...args);
    };

    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      historyRef.pushState = originalPushState;
      historyRef.replaceState = originalReplaceState;
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("popstate", onPopState);
      pendingStartRef.current = false;
      if (startRafRef.current !== null) {
        window.cancelAnimationFrame(startRafRef.current);
        startRafRef.current = null;
      }
      clearTimers();
    };
  }, [clearTimers, isDifferentPathSearch, scheduleStart]);

  React.useEffect(() => {
    finish();
  }, [pathname, search, finish]);

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-[2147482000] h-[3px]",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div
        className="bg-primary h-full shadow-[0_0_14px_hsl(var(--primary)/0.7)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
