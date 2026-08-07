import { NextResponse } from "next/server";

export const runtime = "nodejs";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

function buildServiceWorker() {
  return `/* No2ta Firebase Messaging Service Worker */
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

const firebaseConfig = ${JSON.stringify(firebaseConfig)};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || (payload.notification && payload.notification.title) || "إشعار جديد";
  const body = data.body || (payload.notification && payload.notification.body) || "";
  const link = data.link || data.url || "/dashboard";

  const options = {
    body,
    icon: data.icon || "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { link, url: link },
    timestamp: Date.now(),
  };

  if (data.tag) options.tag = data.tag;

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const link = (event.notification.data && (event.notification.data.link || event.notification.data.url)) || "/dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          try {
            client.navigate(link);
          } catch (error) {
            // Ignore navigation failures.
          }
          return client.focus();
        }
      }
      return self.clients.openWindow(link);
    }),
  );
});
`;
}

export async function GET() {
  return new NextResponse(buildServiceWorker(), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, max-age=0",
      "Service-Worker-Allowed": "/",
    },
  });
}
