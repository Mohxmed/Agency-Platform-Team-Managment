"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { getDocumentById, setDocument } from "@/lib/firestoreService";
import { clearSettingsCache } from "@/lib/settingsCache";

export function useSettingsDashboard(defaults) {
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
        toast.success("تم حفظ الإعدادات بنجاح");
      } catch (err) {
        console.error("Save failed:", err);
        toast.error("حدث خطأ أثناء الحفظ");
      } finally {
        setSaving(false);
      }
    },
    [saving],
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
