"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type TelegramContextValue = {
  initData: string | null;
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  } | null;
  profile?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    telegramUsername?: string | null;
    role: string;
    phone?: string | null;
  } | null;
  profileLoading?: boolean;
};

const TelegramContext = createContext<TelegramContextValue>({
  initData: null,
  user: null,
  profile: null,
  profileLoading: false
});

export function TelegramWebAppProvider({ children }: { children: React.ReactNode }) {
  const [initData, setInitData] = useState<string | null>(null);
  const [user, setUser] = useState<TelegramContextValue["user"]>(null);
  const [profile, setProfile] = useState<TelegramContextValue["profile"]>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const webApp = (window as any).Telegram?.WebApp;
    if (!webApp) return;
    webApp.ready();
    setInitData(webApp.initData || null);
    setUser(webApp.initDataUnsafe?.user || null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadProfile = async () => {
      setProfileLoading(true);
      const response = await fetch("/api/me", {
        headers: { "X-Telegram-Init-Data": initData || "" }
      });
      if (!response.ok) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }
      const payload = await response.json();
      setProfile(payload.user ?? null);
      setProfileLoading(false);
    };
    loadProfile();
  }, [initData]);

  const value = useMemo(
    () => ({ initData, user, profile, profileLoading }),
    [initData, user, profile, profileLoading]
  );

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegramWebApp() {
  return useContext(TelegramContext);
}
