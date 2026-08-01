import { getDocumentById } from "./firestoreService";

let cachePromise = null;
let cachedData = null;

export function fetchSettings(forceRefresh = false) {
  if (!forceRefresh && cachedData) {
    return Promise.resolve(cachedData);
  }
  if (!forceRefresh && cachePromise) {
    return cachePromise;
  }
  cachePromise = getDocumentById("settings", "site").then((data) => {
    cachedData = data;
    cachePromise = null;
    return data;
  });
  return cachePromise;
}

export function clearSettingsCache() {
  cachedData = null;
  cachePromise = null;
}
