"use client";

import { useCallback, useRef, useState } from "react";
import { getDocumentById, setDocument } from "@/lib/firestoreService";
import { clearSettingsCache } from "@/lib/settingsCache";
import { useToast } from "@/hooks/useToast";

export function useSettingsDashboard(defaults) {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const data = await getDocumentById("settings", "site");
      if (data) {
        setSettings({ ...defaults, ...data });
      }
    } finally {
      setLoading(false);
    }
  }, [defaults]);

  const save = useCallback(
    async (data) => {
      if (saving) return;
      setSaving(true);
      try {
        await setDocument("settings", "site", data);
        clearSettingsCache();
        setSettings((prev) => ({ ...prev, ...data }));
        showToast({
          type: "success",
          title: "تم الحفظ بنجاح",
          message: "تم حفظ الإعدادات وتطبيقها.",
        });
      } catch (err) {
        console.error("Save failed:", err);
        showToast({
          type: "error",
          title: "حدث خطأ",
          message: "تعذر حفظ الإعدادات، حاول مرة أخرى.",
        });
      } finally {
        setSaving(false);
      }
    },
    [saving, showToast],
  );

  const update = useCallback((name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  }, []);

  const updateNested = useCallback((group, name, value) => {
    setSettings((prev) => ({
      ...prev,
      [group]: { ...prev[group], [name]: value },
    }));
  }, []);

  const updatePath = useCallback((path, value) => {
    setSettings((prev) => {
      const next = { ...prev };
      const keys = Array.isArray(path) ? path : String(path).split(".");
      let node = next;
      for (let i = 0; i < keys.length - 1; i++) {
        node[keys[i]] = { ...(node[keys[i]] || {}) };
        node = node[keys[i]];
      }
      node[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  return { settings, setSettings, loading, saving, load, save, update, updateNested, updatePath };
}
