"use client";

import { useEffect, useRef, useState } from "react";

import {
  UploadCloud,
  Image as ImageIcon,
  X,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Link,
  Plus,
} from "lucide-react";

function ModeToggle({ mode, onSwitch }) {
  return (
    <div className="flex rounded-lg border border-ink/[0.08] p-0.5 bg-card/50">
      <button
        type="button"
        onClick={() => onSwitch("upload")}
        className={`
          flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all
          ${mode === "upload"
            ? "bg-card text-ink shadow-sm"
            : "text-ink/60 hover:text-ink/60"
          }
        `}
      >
        <UploadCloud className="h-3.5 w-3.5" />
        رفع
      </button>
      <button
        type="button"
        onClick={() => onSwitch("url")}
        className={`
          flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all
          ${mode === "url"
            ? "bg-card text-ink shadow-sm"
            : "text-ink/60 hover:text-ink/60"
          }
        `}
      >
        <Link className="h-3.5 w-3.5" />
        رابط
      </button>
    </div>
  );
}

function UrlInput({ value, onChange, onKeyDown, onSubmit, buttonLabel }) {
  return (
    <div className="flex gap-2">
      <input
        type="url"
        dir="ltr"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="https://example.com/image.jpg"
        className="
          flex-1 h-11 rounded-xl border border-ink/[0.1]
          bg-card px-4 text-sm text-ink
          outline-none transition-all duration-200
          placeholder:text-ink/60
          focus:border-primary-500 focus:ring-4 focus:ring-primary-500/[0.08]
        "
      />
      <button
        type="button"
        onClick={onSubmit}
        className="
          flex h-11 items-center gap-1.5 rounded-xl bg-primary-600
          px-4 text-sm font-bold text-white shadow-sm
          transition-all hover:bg-primary-700 active:scale-95
        "
      >
        <Plus className="h-4 w-4" />
        {buttonLabel}
      </button>
    </div>
  );
}

export default function ImageUploadField({
  label = "صورة المشروع",
  value = "",
  metadata = {},
  onChange,
  storagePath = "projects",
  required = false,
  multiple = false,
}) {
  const widgetRef = useRef(null);
  const scriptRef = useRef(null);

  const valueRef = useRef(value);

  const [ready, setReady] = useState(() => typeof window !== "undefined" && !!window.cloudinary);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      ? "Cloudinary غير مُعد بشكل صحيح. راجع Environment Variables."
      : "",
  );
  const [mode, setMode] = useState("upload");
  const [urlInput, setUrlInput] = useState("");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const images = multiple
    ? Array.isArray(value)
      ? value.filter((item) => typeof item === "string" && item.trim())
      : []
    : value
      ? [value]
      : [];

  useEffect(() => {
    if (!cloudName || !uploadPreset) return;
    if (window.cloudinary) return;

    const scriptUrl = "https://upload-widget.cloudinary.com/latest/global/all.js";
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    if (existingScript) {
      const handleLoad = () => {
        setReady(true);
        setError("");
      };
      existingScript.addEventListener("load", handleLoad);
      return () => {
        existingScript.removeEventListener("load", handleLoad);
      };
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      setReady(true);
      setError("");
    };
    script.onerror = () => {
      setError("فشل تحميل Cloudinary Upload Widget.");
    };
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      scriptRef.current = null;
    };
  }, [cloudName, uploadPreset]);

  /* =========================================================
     MODE SWITCH
  ========================================================= */

  function switchMode(newMode) {
    if (newMode === mode) return;
    setMode(newMode);
    setUrlInput("");
    setError("");

    if (!multiple) {
      valueRef.current = "";
      onChange?.("", null);
    }
  }

  /* =========================================================
     URL INPUT HANDLERS
  ========================================================= */

  function handleUrlSubmit() {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError("الرجاء إدخال رابط الصورة.");
      return;
    }

    if (!/^https?:\/\/.+/.test(trimmed)) {
      setError("الرجاء إدخال رابط صحيح يبدأ بـ http:// أو https://");
      return;
    }

    setError("");

    if (!multiple) {
      valueRef.current = trimmed;
      onChange?.(trimmed, null);
      return;
    }

    const currentImages = Array.isArray(valueRef.current)
      ? valueRef.current.filter((item) => typeof item === "string" && item.trim())
      : [];

    if (currentImages.includes(trimmed)) {
      setError("هذا الرابط مضاف مسبقاً.");
      return;
    }

    const nextImages = [...currentImages, trimmed];
    valueRef.current = nextImages;
    onChange?.(nextImages);
    setUrlInput("");
  }

  function handleUrlKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit();
    }
  }

  /* =========================================================
     CLOUDINARY WIDGET
  ========================================================= */

  function createWidget() {
    if (!ready || !window.cloudinary) {
      setError("Cloudinary لسه بيجهز. حاول مرة تانية.");
      return;
    }
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration missing.");
      return;
    }

    setError("");

    if (widgetRef.current) {
      widgetRef.current.open();
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        multiple,
        maxFiles: multiple ? 20 : 1,
        sources: ["local", "url", "camera"],
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxImageFileSize: 8 * 1024 * 1024,
        cropping: !multiple,
        croppingAspectRatio: 16 / 9,
        showSkipCropButton: true,
        folder: `portfolio/${storagePath}`,
        resourceType: "image",
        theme: "minimal",
        styles: {
          palette: {
            window: "#ffffff",
            windowBorder: "#e5e7eb",
            tabIcon: "#111827",
            menuIcons: "#6b7280",
            textDark: "#111827",
            textLight: "#ffffff",
            link: "#111827",
            action: "#111827",
            inactiveTabIcon: "#9ca3af",
            error: "#dc2626",
            inProgress: "#111827",
            complete: "#16a34a",
            sourceBg: "#f8fafc",
          },
          fonts: {
            default: null,
          },
        },
      },
      (uploadError, result) => {
        if (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          setUploading(false);
          setError(
            uploadError?.statusText ||
              uploadError?.message ||
              "حدث خطأ أثناء رفع الصورة.",
          );
          return;
        }

        if (!result) return;

        if (result.event === "upload-added") {
          setUploading(true);
          setError("");
        }

        if (result.event === "success") {
          const info = result.info;
          const url = info?.secure_url || "";

          if (!url) {
            setError("Cloudinary لم يرجع رابط الصورة.");
            return;
          }

          if (!multiple) {
            const imageMetadata = {
              publicId: info.public_id || "",
              width: info.width || "",
              height: info.height || "",
              format: info.format || "",
              bytes: info.bytes || "",
              resourceType: info.resource_type || "image",
            };

            valueRef.current = url;
            onChange?.(url, imageMetadata);
            setUploading(false);
            setError("");
            return;
          }

          const currentImages = Array.isArray(valueRef.current)
            ? valueRef.current.filter((item) => typeof item === "string" && item.trim())
            : [];

          if (currentImages.includes(url)) {
            setUploading(false);
            return;
          }

          const nextImages = [...currentImages, url];
          valueRef.current = nextImages;
          onChange?.(nextImages);
          setUploading(false);
          setError("");
        }

        if (result.event === "close") {
          setUploading(false);
        }
      },
    );

    widgetRef.current = widget;
    widget.open();
  }

  /* =========================================================
     REMOVE SINGLE IMAGE
  ========================================================= */

  function handleRemoveSingle() {
    if (uploading) return;
    valueRef.current = "";
    onChange?.("", null);
    setError("");
  }

  /* =========================================================
     REMOVE GALLERY IMAGE
  ========================================================= */

  function handleRemoveGalleryImage(index) {
    if (uploading) return;

    const currentImages = Array.isArray(valueRef.current)
      ? valueRef.current
      : [];

    const nextImages = currentImages.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    valueRef.current = nextImages;
    onChange?.(nextImages);
    setError("");
  }

  /* =========================================================
     SINGLE IMAGE
  ========================================================= */

  if (!multiple) {
    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-ink">
            {label}
            {required && <span className="mr-1 text-danger">*</span>}
          </label>

          <div className="flex items-center gap-2">
            {value && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                تم الإضافة
              </span>
            )}
            <ModeToggle mode={mode} onSwitch={switchMode} />
          </div>
        </div>

        {mode === "url" ? (
          <div className="space-y-3">
            <UrlInput
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={handleUrlKeyDown}
              onSubmit={handleUrlSubmit}
              buttonLabel="تأكيد"
            />

            {value && (
              <div className="group relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-[#f8f8f8] dark:bg-surface">
                <div className="aspect-[16/8] w-full">
                  <img
                    src={value}
                    alt="Project preview"
                    className="
                      h-full w-full object-cover transition-transform
                      duration-700 group-hover:scale-[1.02]
                    "
                  />
                </div>

                <div
                  className="
                    absolute inset-0 flex items-center justify-center gap-2
                    bg-ink/0 opacity-0 transition-all duration-300
                    group-hover:bg-ink/35 group-hover:opacity-100
                  "
                >
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="فتح الصورة في تبويب جديد"
                    className="
                      flex h-10 w-10 items-center justify-center rounded-xl
                      bg-card text-ink shadow-xl transition hover:scale-105
                    "
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <button
                  type="button"
                  aria-label="حذف الصورة"
                  onClick={handleRemoveSingle}
                  className="
                    absolute left-3 top-3 flex h-8 w-8 items-center justify-center
                    rounded-lg bg-ink/50 text-white opacity-0 backdrop-blur-md
                    transition group-hover:opacity-100 hover:bg-danger
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : value ? (
          <div className="group relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-[#f8f8f8] dark:bg-surface">
            <div className="aspect-[16/8] w-full">
              <img
                src={value}
                alt="Project preview"
                className="
                  h-full w-full object-cover transition-transform
                  duration-700 group-hover:scale-[1.02]
                "
              />
            </div>

            <div
              className="
                absolute inset-0 flex items-center justify-center gap-2
                bg-ink/0 opacity-0 transition-all duration-300
                group-hover:bg-ink/35 group-hover:opacity-100
              "
            >
              <button
                type="button"
                onClick={createWidget}
                disabled={uploading}
                className="
                  flex h-10 items-center gap-2 rounded-xl bg-card px-4
                  text-xs font-bold text-ink shadow-xl transition hover:scale-105
                "
              >
                <RefreshCw className="h-4 w-4" />
                تغيير الصورة
              </button>

              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                aria-label="فتح الصورة في تبويب جديد"
                className="
                  flex h-10 w-10 items-center justify-center rounded-xl
                  bg-card text-ink shadow-xl transition hover:scale-105
                "
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <button
              type="button"
              aria-label="حذف الصورة"
              onClick={handleRemoveSingle}
              disabled={uploading}
              className="
                absolute left-3 top-3 flex h-8 w-8 items-center justify-center
                rounded-lg bg-ink/50 text-white opacity-0 backdrop-blur-md
                transition group-hover:opacity-100 hover:bg-danger
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={createWidget}
            disabled={!ready || uploading}
            className="
              group relative flex min-h-[210px] w-full flex-col items-center
              justify-center overflow-hidden rounded-2xl border border-dashed
              border-ink/[0.12] bg-[#fafafa] px-6 text-center
              transition-all duration-300 hover:border-ink/20
              hover:bg-[#f7f7f7] hover:shadow-sm
              dark:bg-surface dark:hover:bg-surface-hover
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <div
              className="
                relative flex h-14 w-14 items-center justify-center rounded-2xl
                bg-card text-ink/60 shadow-sm ring-1 ring-ink/[0.06]
              "
            >
              {uploading ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <UploadCloud className="h-6 w-6" />
              )}
            </div>

            <p className="relative mt-4 text-sm font-bold text-ink/75">
              {uploading
                ? "جاري رفع الصورة..."
                : ready
                  ? "ارفع الصورة الأساسية"
                  : "جاري تجهيز Cloudinary..."}
            </p>

            <p className="relative mt-1 max-w-xs text-xs leading-5 text-ink/60">
              JPG, PNG أو WebP
              <br />
              حتى 8MB • يمكنك القص قبل الرفع
            </p>
          </button>
        )}

        {error && (
          <div
            className="
              flex items-start gap-2 rounded-xl border border-danger/10
              bg-danger/[0.04] px-3 py-2.5 text-xs leading-5 text-danger
            "
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && mode === "upload" && (
          <div className="flex items-center gap-1.5 text-[11px] text-ink/60">
            <ImageIcon className="h-3.5 w-3.5" />
            الصورة سيتم تخزينها على Cloudinary
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     GALLERY
  ========================================================= */

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-ink">
          {label}
          {required && <span className="mr-1 text-danger">*</span>}
        </label>

        <div className="flex items-center gap-2">
          {images.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {images.length} صورة
            </span>
          )}
          <ModeToggle mode={mode} onSwitch={switchMode} />
        </div>
      </div>

      {mode === "url" && (
        <div className="mb-3">
          <UrlInput
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleUrlKeyDown}
            onSubmit={handleUrlSubmit}
            buttonLabel="إضافة"
          />
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="
                group relative aspect-[4/3] overflow-hidden rounded-2xl
                border border-ink/[0.08] bg-[#f8f8f8] dark:bg-surface
              "
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="
                  h-full w-full object-cover transition duration-500
                  group-hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/30" />

              <div
                className="
                  absolute right-2 top-2 flex h-7 min-w-7 items-center justify-center
                  rounded-lg bg-ink/55 px-1.5 text-[10px] font-black text-white
                  backdrop-blur-md
                "
              >
                {index + 1}
              </div>

              <div
                className="
                  absolute inset-x-2 bottom-2 flex items-center justify-between
                  opacity-0 transition group-hover:opacity-100
                "
              >
                <a
                  href={image}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="فتح الصورة في تبويب جديد"
                  className="
                    flex h-8 w-8 items-center justify-center rounded-lg
                    bg-card text-ink shadow-lg
                  "
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  type="button"
                  aria-label="حذف الصورة"
                  onClick={() => handleRemoveGalleryImage(index)}
                  disabled={uploading}
                  className="
                    flex h-8 w-8 items-center justify-center rounded-lg
                    bg-card text-danger shadow-lg transition
                    hover:bg-danger hover:text-white
                  "
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === "upload" && (
        <button
          type="button"
          onClick={createWidget}
          disabled={!ready || uploading}
          className="
            group flex min-h-[150px] w-full flex-col items-center justify-center
            rounded-2xl border border-dashed border-ink/[0.12] bg-[#fafafa]
            px-6 text-center transition-all hover:border-ink/20
            hover:bg-[#f7f7f7] hover:shadow-sm
            dark:bg-surface dark:hover:bg-surface-hover
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          <div
            className="
              flex h-12 w-12 items-center justify-center rounded-xl
              bg-card text-ink/60 shadow-sm ring-1 ring-ink/[0.06]
              transition group-hover:-translate-y-1 group-hover:text-ink
            "
          >
            {uploading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>

          <p className="mt-3 text-sm font-bold text-ink/70">
            {uploading
              ? "جاري رفع الصور..."
              : images.length
                ? "إضافة صور أخرى"
                : "إضافة صور الـ Gallery"}
          </p>

          <p className="mt-1 text-xs text-ink/60">
            يمكنك اختيار أكثر من صورة مرة واحدة
          </p>
        </button>
      )}

      {error && (
        <div
          className="
            flex items-start gap-2 rounded-xl border border-danger/10
            bg-danger/[0.04] px-3 py-2.5 text-xs leading-5 text-danger
          "
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && mode === "upload" && (
        <div className="flex items-center gap-1.5 text-[11px] text-ink/60">
          <ImageIcon className="h-3.5 w-3.5" />
          يمكنك إضافة حتى 20 صورة
        </div>
      )}
    </div>
  );
}
