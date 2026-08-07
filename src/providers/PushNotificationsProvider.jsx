"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth";

import {
  subscribeToNotifications,
  setNotificationAuthToken,
} from "@/lib/firestoreService";
import {
  getPushPermission,
  isBrowserNotificationSupported,
  requestPushPermission,
} from "@/lib/pushService";

const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000;

const notificationIds = new Set();

function showBrowserNotification(notification) {
  const title = notification.title || "إشعار جديد";
  const body = notification.message || "";
  const link = notification.link || "/dashboard";

  try {
    if (navigator.serviceWorker && "ready" in navigator.serviceWorker) {
      navigator.serviceWorker.ready
        .then((registration) => {
          if (!registration) return;
          registration.showNotification(title, {
            body,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            data: { link },
          });
        })
        .catch(() => {
          // Fall back to a plain browser notification.
          new Notification(title, { body, icon: "/icons/icon-192.png" });
        });
      return;
    }

    new Notification(title, { body, icon: "/icons/icon-192.png" });
  } catch (error) {
    console.error("Failed to show browser notification:", error);
  }
}

export default function PushNotificationsProvider() {
  const { user } = useAuth();

  const initializedFor = useRef(null);

  /* =========================================================
     KEEP A FRESH ID TOKEN FOR THE PUSH API
  ========================================================= */

  useEffect(() => {
    if (!user) {
      setNotificationAuthToken("");
      return;
    }

    let cancelled = false;

    const refresh = (force) =>
      user
        .getIdToken(force)
        .then((token) => {
          if (!cancelled) setNotificationAuthToken(token);
        })
        .catch(() => {
          // Best-effort.
        });

    refresh(false);

    const interval = setInterval(() => refresh(true), TOKEN_REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  /* =========================================================
     REQUEST PERMISSION + SAVE FCM TOKEN (background push)
  ========================================================= */

  useEffect(() => {
    if (!user?.uid) return;
    if (typeof window === "undefined") return;
    if (!window.location.pathname.startsWith("/dashboard")) return;
    if (!isBrowserNotificationSupported()) return;
    if (getPushPermission() === "denied") return;

    requestPushPermission({ userId: user.uid }).catch(() => {
      // Best-effort: push stays disabled until permission is granted.
    });
  }, [user?.uid]);

  /* =========================================================
     FOREGROUND BROWSER NOTIFICATIONS VIA FIRESTORE
     (background delivery is handled by the messaging SW)
  ========================================================= */

  useEffect(() => {
    if (!user?.uid) return;
    if (typeof window === "undefined") return;
    if (!isBrowserNotificationSupported()) return;
    if (getPushPermission() !== "granted") return;

    const unsubscribe = subscribeToNotifications(user.uid, (items) => {
      if (initializedFor.current !== user.uid) {
        initializedFor.current = user.uid;
        items.forEach((item) => {
          notificationIds.add(item.id);
        });
        return;
      }

      if (document.visibilityState !== "visible") return;

      items.forEach((item) => {
        if (notificationIds.has(item.id)) return;
        notificationIds.add(item.id);

        if (item.read) return;

        showBrowserNotification(item);
      });
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  return null;
}
