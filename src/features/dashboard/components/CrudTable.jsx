"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Database,
  Activity,
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import Input, { Textarea, Select } from "../ui/Input";
import EmptyState from "../ui/EmptyState";
import ImageUploadField from "./ImageUploadField";
import IconPicker from "./IconPicker";
import {
  subscribeToCollection,
  createDocument,
  updateDocument,
  removeDocument,
} from "@/lib/firestoreService";
import StatsCard from "@/features/dashboard/ui/StatsCard";
import PageHero from "./PageHero";
import { getThemeByName } from "@/constants/pageThemes";
import { usePageTheme } from "../hooks/usePageTheme";
import { useToast } from "@/hooks/useToast";

export default function CrudTable({
  collectionName,
  fields = [],
  columns = [],
  storagePath,
  entityName = "العنصر",
  entityNamePlural = "العناصر",
  icon: EntityIcon = Database,
  titleField = "title",
  emptyTitle,
  emptyDescription = "",
  createEvent = "open-create",
  stats = true,
  pageSize = 10,
  accent,
}) {
  const pageTheme = usePageTheme();
  const { showToast } = useToast();

  const theme = accent
    ? typeof accent === "string"
      ? getThemeByName(accent)
      : accent
    : pageTheme;
  /* =========================================================
     STATE
  ========================================================= */

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formMeta, setFormMeta] = useState({});
  const [saving, setSaving] = useState(false);
  const [relationOptions, setRelationOptions] = useState({});

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  function handleSearchClear() {
    setSearch("");
    setCurrentPage(1);
  }

  /* =========================================================
     FIRESTORE - MAIN COLLECTION
  ========================================================= */

  useEffect(() => {
    if (!collectionName) return;

    const unsubscribe = subscribeToCollection(collectionName, (data) => {
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [collectionName]);
  /* =========================================================
     RELATION OPTIONS
  ========================================================= */
  useEffect(() => {
    const collectionFields = fields.filter(
      (field) => field.type === "collection-select" && field.collection,
    );
    if (collectionFields.length === 0) {
      return;
    }
    const unsubscribers = collectionFields.map((field) => {
      return subscribeToCollection(field.collection, (data) => {
        setRelationOptions((previous) => ({
          ...previous,
          [field.name]: Array.isArray(data) ? data : [],
        }));
      });
    });
    return () => {
      unsubscribers.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, [fields]);
  /* =========================================================
     CREATE
  ========================================================= */
  const openCreate = useCallback(() => {
    const initialForm = {};
    fields.forEach((field) => {
      if (field.default !== undefined) {
        initialForm[field.name] = field.default;
        return;
      }
      if (field.type === "images" || field.type === "stats") {
        initialForm[field.name] = [];
        return;
      }
      initialForm[field.name] = "";
    });
    setEditing(null);
    setForm(initialForm);
    setFormMeta({});
    setModalOpen(true);
  }, [fields]);
  /* =========================================================
     EDIT
  ========================================================= */
  function openEdit(item) {
    const editForm = {};
    const existingMeta = {};
    fields.forEach((field) => {
      if (field.type === "stats") {
        editForm[field.name] = Array.isArray(item?.[field.name])
          ? item[field.name]
              .filter((stat) => stat && typeof stat === "object")
              .map((stat) => ({
                label: stat.label ?? "",
                value: stat.value ?? "",
              }))
          : [];

        return;
      }
      if (field.type === "images") {
        editForm[field.name] = Array.isArray(item?.[field.name])
          ? item[field.name].filter(
              (url) => typeof url === "string" && url.trim(),
            )
          : [];
        return;
      }
      editForm[field.name] = item?.[field.name] ?? "";
    });
    fields.forEach((field) => {
      if (field.type !== "image") {
        return;
      }
      const prefix = field.name;

      const metadata = {
        publicId: item?.[`${prefix}PublicId`] || "",

        width: item?.[`${prefix}Width`] || "",

        height: item?.[`${prefix}Height`] || "",

        format: item?.[`${prefix}Format`] || "",

        bytes: item?.[`${prefix}Bytes`] || "",

        resourceType: item?.[`${prefix}ResourceType`] || "",
      };

      if (Object.values(metadata).some(Boolean)) {
        existingMeta[prefix] = metadata;
      }
    });

    setEditing(item);
    setForm(editForm);
    setFormMeta(existingMeta);
    setModalOpen(true);
  }

  /* =========================================================
     CLOSE
  ========================================================= */

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditing(null);
    setForm({});
    setFormMeta({});
  }

  /* =========================================================
     UPDATE NORMAL FIELD
  ========================================================= */

  function updateField(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /* =========================================================
     UPDATE STATS
  ========================================================= */

  function updateStatsField(name, stats) {
    setForm((previous) => ({
      ...previous,
      [name]: Array.isArray(stats)
        ? stats.map((stat) => ({
            label: stat?.label ?? "",
            value: stat?.value ?? "",
          }))
        : [],
    }));
  }

  /* =========================================================
     UPDATE IMAGE / GALLERY
  ========================================================= */

  function updateImageField(name, value, metadata = null, action = null) {
    if (Array.isArray(value)) {
      const cleanImages = value
        .flat(Infinity)
        .filter((item) => typeof item === "string" && item.trim());

      setForm((previous) => ({
        ...previous,
        [name]: cleanImages,
      }));

      return;
    }

    const cleanValue = typeof value === "string" ? value.trim() : "";

    setForm((previous) => ({
      ...previous,
      [name]: cleanValue,
    }));

    if (metadata && typeof metadata === "object") {
      setFormMeta((previous) => ({
        ...previous,
        [name]: metadata,
      }));
    } else {
      setFormMeta((previous) => {
        const next = {
          ...previous,
        };

        delete next[name];

        return next;
      });
    }
  }

  /* =========================================================
     SAVE
  ========================================================= */

  async function handleSave(event) {
    event?.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const cleanData = {};

      fields.forEach((field) => {
        if (field.type === "stats") {
          const cleanStats = Array.isArray(form[field.name])
            ? form[field.name]
                .map((stat) => ({
                  label: String(stat?.label ?? "").trim(),

                  value: String(stat?.value ?? "").trim(),
                }))
                .filter((stat) => stat.label || stat.value)
            : [];

          cleanData[field.name] = cleanStats;

          return;
        }

        if (field.type === "images") {
          const images = Array.isArray(form[field.name])
            ? form[field.name]
                .flat(Infinity)
                .filter((item) => typeof item === "string" && item.trim())
            : [];

          cleanData[field.name] = images;

          return;
        }

        cleanData[field.name] = form[field.name] ?? "";
      });

      Object.entries(formMeta).forEach(([fieldName, metadata]) => {
        if (
          !metadata ||
          typeof metadata !== "object" ||
          Array.isArray(metadata)
        ) {
          return;
        }

        if (metadata.publicId) {
          cleanData[`${fieldName}PublicId`] = metadata.publicId;
        }

        if (metadata.width) {
          cleanData[`${fieldName}Width`] = metadata.width;
        }

        if (metadata.height) {
          cleanData[`${fieldName}Height`] = metadata.height;
        }

        if (metadata.format) {
          cleanData[`${fieldName}Format`] = metadata.format;
        }

        if (metadata.bytes) {
          cleanData[`${fieldName}Bytes`] = metadata.bytes;
        }

        if (metadata.resourceType) {
          cleanData[`${fieldName}ResourceType`] = metadata.resourceType;
        }
      });

      if (editing) {
        await updateDocument(collectionName, editing.id, cleanData);
      } else {
        await createDocument(collectionName, cleanData);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving document:", error);

      showToast({
        type: "error",
        title: "حدث خطأ",
        message: `تعذر حفظ ${entityName}.`,
      });
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DELETE
  ========================================================= */

  async function handleDelete(item) {
    const title =
      item?.[titleField] || item?.name || item?.title || `هذا ${entityName}`;

    const confirmed = window.confirm(`هل أنت متأكد من حذف "${title}"؟`);

    if (!confirmed) return;

    try {
      await removeDocument(collectionName, item.id);

      showToast({
        type: "success",
        title: "تم الحذف",
        message: `تم حذف ${entityName} بنجاح.`,
      });
    } catch (error) {
      console.error("Error deleting document:", error);

      showToast({
        type: "error",
        title: "حدث خطأ",
        message: `تعذر حذف ${entityName}.`,
      });
    }
  }

  /* =========================================================
     EXTERNAL CREATE EVENT
  ========================================================= */

  useEffect(() => {
    if (!createEvent) return;

    function handleExternalCreate() {
      openCreate();
    }

    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("quickActionCreate") === createEvent) {
        sessionStorage.removeItem("quickActionCreate");
        // Intentional: open the create modal once on mount via a stored flag.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        openCreate();
      }
    }

    window.addEventListener(createEvent, handleExternalCreate);

    return () => {
      window.removeEventListener(createEvent, handleExternalCreate);
    };
  }, [createEvent, openCreate]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) => {
      return columns.some((column) => {
        if (column.type === "image") {
          return false;
        }

        const value = item?.[column.key] ?? "";

        return String(value).toLowerCase().includes(normalizedSearch);
      });
    });
  }, [items, columns, normalizedSearch]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

  const currentPageClamped = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPageClamped - 1) * pageSize;

    const endIndex = startIndex + pageSize;

    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPageClamped, pageSize]);

  /* =========================================================
     PAGE NUMBERS
  ========================================================= */

  const pageNumbers = useMemo(() => {
    const pages = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);

    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  /* =========================================================
     STATS
  ========================================================= */

  const defaultStats = [
    {
      label: `إجمالي ${entityNamePlural}`,
      value: items.length,
      description: "إجمالي السجلات الموجودة في قاعدة البيانات.",
      icon: Database,
      accent: "red",
      footer: "Firestore Collection",
    },

    {
      label: "نتائج البحث",
      value: filteredItems.length,
      description: normalizedSearch
        ? "عدد النتائج المطابقة للبحث الحالي."
        : "يتم عرض جميع السجلات حاليًا.",
      icon: Search,
      accent: "dark",
      footer: normalizedSearch ? "Current Query" : "All Records",
    },

    {
      label: "حالة البيانات",
      value: "مباشر",
      description: "البيانات متزامنة لحظيًا مع Firestore.",
      icon: Activity,
      accent: "red",
      footer: "Real-time Sync",
      trend: "● متصل",
    },
  ];

  const statsItems =
    typeof stats === "function"
      ? stats({
          items,
          filteredItems,
          search: normalizedSearch,
        })
      : defaultStats;

  /* =========================================================
     RENDER FIELD
  ========================================================= */

  function renderField(field) {
    const value = form[field.name] ?? "";

    /* =======================================================
       TEXTAREA
    ======================================================== */
    if (field.type === "icon-picker") {
      return (
        <IconPicker
          key={field.name}
          label={field.label}
          value={value}
          onChange={(iconName) => updateField(field.name, iconName)}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          key={field.name}
          id={field.name}
          label={field.label}
          value={value}
          required={field.required}
          placeholder={field.placeholder}
          rows={field.rows || 4}
          onChange={(event) => updateField(field.name, event.target.value)}
          className={`
            border
            ${theme.borderSoft}
            ${theme.searchBg}
            shadow-none
            transition
            focus:bg-card
            focus:ring-4
            ${theme.focus}
          `}
        />
      );
    }

    /* =======================================================
       NORMAL SELECT
    ======================================================== */

    if (field.type === "select") {
      return (
        <Select
          key={field.name}
          id={field.name}
          label={field.label}
          value={value}
          options={field.options || []}
          required={field.required}
          onChange={(event) => updateField(field.name, event.target.value)}
        />
      );
    }

    /* =======================================================
       COLLECTION SELECT
    ======================================================== */

    if (field.type === "collection-select") {
      const options = relationOptions[field.name] || [];

      const optionValue = field.optionValue || "id";

      const optionLabel = field.optionLabel || "name";

      return (
        <Select
          key={field.name}
          id={field.name}
          label={field.label}
          value={value}
          required={field.required}
          options={[
            {
              value: "",
              label: field.placeholder || `اختر ${field.label}`,
            },

            ...options.map((option) => ({
              value: option[optionValue],

              label: option[optionLabel],
            })),
          ]}
          onChange={(event) => updateField(field.name, event.target.value)}
        />
      );
    }

    /* =======================================================
       GENERIC STATS
    ======================================================== */

    if (field.type === "stats") {
      const statsValue = Array.isArray(value) ? value : [];

      function addStat() {
        updateStatsField(field.name, [
          ...statsValue,
          {
            label: "",
            value: "",
          },
        ]);
      }

      function removeStat(index) {
        updateStatsField(
          field.name,
          statsValue.filter((_, statIndex) => statIndex !== index),
        );
      }

      function updateStat(index, key, statValue) {
        const nextStats = [...statsValue];

        nextStats[index] = {
          ...nextStats[index],
          [key]: statValue,
        };

        updateStatsField(field.name, nextStats);
      }

      return (
        <div
          key={field.name}
          className={`
            space-y-4
            rounded-2xl
            border
            ${theme.borderSoft}
            bg-gradient-to-br
            ${theme.tableHeaderBg}
            via-card
            to-gray-50
            p-4
          `}
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <div
                  className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    ${theme.chip}
                  `}
                >
                  <Sparkles className="h-4 w-4" />
                </div>

                <p className="text-sm font-black text-ink">{field.label}</p>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-ink/60">
                أضف أي عدد من الإحصائيات بالاسم والقيمة.
              </p>
            </div>

            <Button
              type="button"
              icon={Plus}
              onClick={addStat}
              className={`
                rounded-xl
                ${theme.solid}
                ${theme.solidText}
                shadow-md
                ${theme.solidHover}
              `}
            >
              إضافة
            </Button>
          </div>

          {statsValue.length === 0 && (
            <div
              className={`
                flex
                min-h-[110px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                ${theme.border}
                bg-card
                text-center
              `}
            >
              <Activity className={`h-5 w-5 ${theme.textSoft}`} />

              <p className="mt-2 text-xs font-semibold text-ink/60">
                لا توجد إحصائيات
              </p>

              <button
                type="button"
                onClick={addStat}
                className={`
                  mt-2
                  text-xs
                  font-bold
                  ${theme.text}
                  transition
                  ${theme.textStrong}
                `}
              >
                + إضافة إحصائية
              </button>
            </div>
          )}

          {statsValue.length > 0 && (
            <div className="space-y-3">
              {statsValue.map((stat, index) => (
                <div
                  key={index}
                  className={`
                      flex
                      items-end
                      gap-2
                      rounded-xl
                      border
                      ${theme.borderSoft}
                      bg-card
                      p-3
                      shadow-sm
                    `}
                >
                  <div className="min-w-0 flex-1">
                    <Input
                      id={`${field.name}-label-${index}`}
                      label="اسم الإحصائية"
                      value={stat?.label ?? ""}
                      placeholder="مثال: متابعين"
                      onChange={(event) =>
                        updateStat(index, "label", event.target.value)
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Input
                      id={`${field.name}-value-${index}`}
                      label="القيمة"
                      value={stat?.value ?? ""}
                      placeholder="مثال: 510K"
                      onChange={(event) =>
                        updateStat(index, "value", event.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    title="حذف الإحصائية"
                    className="
                        mb-0.5
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-50
                        text-red-400
                        transition-all
                        hover:bg-red-100
                        hover:text-red-600
                      "
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    /* =======================================================
       SINGLE IMAGE
    ======================================================== */

    if (field.type === "image") {
      return (
        <ImageUploadField
          key={field.name}
          label={field.label}
          value={value}
          metadata={formMeta[field.name] || {}}
          storagePath={storagePath || collectionName}
          required={field.required}
          multiple={false}
          onChange={(image, metadata) =>
            updateImageField(field.name, image, metadata)
          }
        />
      );
    }

    /* =======================================================
       GALLERY
    ======================================================== */

    if (field.type === "images") {
      return (
        <ImageUploadField
          key={field.name}
          label={field.label}
          value={Array.isArray(value) ? value : []}
          storagePath={storagePath || collectionName}
          required={field.required}
          multiple
          onChange={(images) => updateImageField(field.name, images)}
        />
      );
    }

    /* =======================================================
       DEFAULT INPUT
    ======================================================== */

    return (
      <Input
        key={field.name}
        id={field.name}
        label={field.label}
        type={field.type || "text"}
        value={value}
        required={field.required}
        placeholder={field.placeholder}
        onChange={(event) => updateField(field.name, event.target.value)}
      />
    );
  }

  /* =========================================================
     RENDER COLUMN VALUE
  ========================================================= */

  function renderColumnValue(column, value, item) {
    if (column.render) {
      return column.render(value, item);
    }

    /* =======================================================
       IMAGE
    ======================================================== */

    if (column.type === "image") {
      if (value) {
        return (
          <div
            className={`
              relative
              h-14
              w-20
              overflow-hidden
              rounded-xl
              border
              ${theme.borderSoft}
              ${theme.bgSoft}
              shadow-sm
            `}
          >
            <img
              src={value}
              alt={item?.[titleField] || entityName}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-110
              "
            />
          </div>
        );
      }

      return (
        <div
          className={`
            flex
            h-14
            w-20
            items-center
            justify-center
            rounded-xl
            ${theme.bgSoft}
            ${theme.textSoft}
          `}
        >
          <EntityIcon className="h-5 w-5" />
        </div>
      );
    }

    /* =======================================================
       BADGE
    ======================================================== */

    if (column.type === "badge") {
      return value ? (
        <span
          className={`
            inline-flex
            items-center
            rounded-lg
            border
            ${theme.borderSoft}
            px-2.5
            py-1.5
            text-xs
            font-bold
            ${theme.chip}
          `}
        >
          {value}
        </span>
      ) : (
        <span className="text-ink/20">—</span>
      );
    }

    /* =======================================================
       RELATION
    ======================================================== */

    if (column.type === "relation") {
      const options = relationOptions[column.key] || [];

      const labelField = column.labelField || "name";

      const relatedItem = options.find((option) => option.id === value);

      return (
        relatedItem?.[labelField] || <span className="text-ink/20">—</span>
      );
    }

    /* =======================================================
       DEFAULT
    ======================================================== */

    return (
      <span
        className="
          block
          truncate
          text-sm
          font-semibold
          text-ink/75
        "
      >
        {value || <span className="font-normal text-ink/20">—</span>}
      </span>
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div dir="rtl" className="space-y-6">
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="space-y-3">
            <div className={`h-8 w-52 animate-pulse rounded-xl ${theme.bgSoftStrong}`} />

            <div className={`h-4 w-80 animate-pulse rounded-lg ${theme.bgSoft}`} />
          </div>

          <div className={`h-11 w-40 animate-pulse rounded-xl ${theme.bgSoftStrong}`} />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className={`h-28 animate-pulse rounded-2xl border ${theme.borderSoft} ${theme.bgSofter}`} />
          <div className="h-28 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
          <div className={`h-28 animate-pulse rounded-2xl border ${theme.borderSoft} ${theme.bgSofter}`} />
        </div>

        <div className={`h-16 animate-pulse rounded-2xl ${theme.bgSoft}`} />

        <Card className={`overflow-hidden border ${theme.borderSoft} p-0 shadow-none`}>
          <div className={`divide-y ${theme.borderFaint ? "divide-gray-50" : "divide-gray-50"}`}>
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="
                    flex
                    items-center
                    gap-4
                    px-5
                    py-5
                  "
              >
                <div className={`h-12 w-16 animate-pulse rounded-xl ${theme.bgSoft}`} />

                <div className="flex-1 space-y-2">
                  <div className={`h-4 w-44 animate-pulse rounded ${theme.bgSoft}`} />

                  <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
                </div>

                <div className={`h-8 w-20 animate-pulse rounded-lg ${theme.bgSoft}`} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div dir="rtl" className="space-y-6">
      {/* =====================================================
          HERO
      ====================================================== */}

      <PageHero
        icon={EntityIcon}
        title={`إدارة ${entityNamePlural}`}
        eyebrow={entityNamePlural}
        badge="CMS"
        subtitle={`إدارة وتنظيم ${entityNamePlural} من لوحة التحكم.`}
        color={theme.name}
      >
        <Button
          icon={Plus}
          onClick={openCreate}
          className={`
            group/btn
            relative
            w-full
            overflow-hidden
            rounded-xl
            ${theme.solid}
            ${theme.solidText}
            shadow-md
            transition-all
            hover:-translate-y-0.5
            hover:shadow-lg
            ${theme.solidHover}
            sm:w-auto
          `}
        >
          <span className="relative z-10">إضافة {entityName}</span>
        </Button>
      </PageHero>

      {/* =====================================================
          DASHBOARD STATS
      ====================================================== */}

      {stats && statsItems.length > 0 && (
        <div
          className="
      grid
      gap-4
      sm:grid-cols-2
      lg:grid-cols-3
    "
        >
          {statsItems.map((stat, index) => (
            <StatsCard
              key={`${stat.label}-${index}`}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              footer={stat.footer}
              trend={stat.trend}
              accent={stat.accent === "dark" ? "ink" : theme}
            />
          ))}
        </div>
      )}
      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <Card
        className={`
          overflow-hidden
          border
          ${theme.borderSoft}
          bg-card
          p-0
          shadow-sm
        `}
      >
        <div
          className="
            flex
            flex-col
            gap-4
            p-4
            sm:p-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="relative w-full lg:max-w-xl">
            <Search
              className={`
                pointer-events-none
                absolute
                right-4
                top-1/2
                h-[18px]
                w-[18px]
                -translate-y-1/2
                ${theme.textSoft}
              `}
            />

            <input
              value={search}
              onChange={handleSearchChange}
              placeholder={`ابحث في ${entityNamePlural}...`}
              className={`
                h-12
                w-full
                rounded-xl
                border
                ${theme.borderSoft}
                ${theme.searchBg}
                pr-11
                pl-11
                text-sm
                font-medium
                text-ink
                outline-none
                shadow-none
                transition-all
                duration-200
                placeholder:text-ink/60
                ${theme.searchHover}
                focus:bg-card
                focus:ring-4
                ${theme.focus}
              `}
            />

            {search && (
              <button
                type="button"
                aria-label="مسح البحث"
                onClick={handleSearchClear}
                className={`
                  absolute
                  left-3
                  top-1/2
                  flex
                  h-7
                  w-7
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-lg
                  ${theme.bgSoft}
                  ${theme.textSoft}
                  transition
                  ${theme.chipHover}
                `}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              text-xs
              text-ink/60
              sm:justify-end
            "
          >
            <span>عرض</span>

            <span
              className={`
                rounded-lg
                px-2.5
                py-1.5
                font-black
                ${theme.chip}
              `}
            >
              {filteredItems.length}
            </span>

            <span>من {items.length}</span>

            {search && (
              <button
                type="button"
                onClick={handleSearchClear}
                className={`mr-2 font-bold ${theme.text} transition ${theme.textStrong}`}
              >
                مسح
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <Card
        className={`
          overflow-hidden
          border
          ${theme.borderSoft}
          bg-card
          p-0
          shadow-sm
        `}
      >
        {filteredItems.length === 0 ? (
          normalizedSearch ? (
            <div
              className="
                flex
                min-h-[360px]
                flex-col
                items-center
                justify-center
                bg-gradient-to-b
                from-surface
                to-background
                px-6
                text-center
              "
            >
              <div
                className={`
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  ${theme.bgSoftStrong}
                  ${theme.text}
                  shadow-sm
                `}
              >
                <Search className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-base font-black text-ink">
                لا توجد نتائج
              </h3>

              <p className="mt-1.5 max-w-sm text-sm leading-6 text-ink/60">
                لم نجد {entityNamePlural} تطابق البحث الحالي.
              </p>

              <button
                type="button"
                onClick={handleSearchClear}
                className={`mt-5 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition ${theme.chip} ${theme.chipHover}`}
              >
                إزالة البحث
                <ArrowUpLeft className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="py-6">
              <EmptyState
                title={emptyTitle || `لا توجد ${entityNamePlural}`}
                description={
                  emptyDescription ||
                  `لم تتم إضافة أي ${entityNamePlural} حتى الآن.`
                }
                action={
                  <Button
                    icon={Plus}
                    onClick={openCreate}
                    className={`
                      rounded-xl
                      ${theme.solid}
                      shadow-md
                    `}
                  >
                    إضافة أول {entityName}
                  </Button>
                }
              />
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[760px]
                text-start
              "
            >
              <thead>
                <tr
                  className={`
                    border-b
                    ${theme.borderSoft}
                    bg-gradient-to-r
                    ${theme.tableHeaderBg}
                    via-card
                    to-gray-50
                  `}
                >
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`
                          whitespace-nowrap
                          px-5
                          py-4
                          text-start
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.08em]
                          ${theme.tableHeaderText}
                        `}
                    >
                      {column.label}
                    </th>
                  ))}

                  <th
                    className={`
                      w-[120px]
                      px-5
                      py-4
                      text-end
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.08em]
                      ${theme.tableHeaderText}
                    `}
                  >
                    الإجراءات
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`
                        group
                        border-b
                        ${theme.borderFaint}
                        last:border-0
                        transition-all
                        duration-200
                        ${theme.rowHover}
                      `}
                  >
                    {columns.map((column) => {
                      const value = item?.[column.key];

                      const isImage = column.type === "image";

                      return (
                        <td
                          key={column.key}
                          className={`
                                ${
                                  isImage
                                    ? "px-5 py-4"
                                    : "max-w-[350px] px-5 py-4 align-middle"
                                }
                              `}
                        >
                          {renderColumnValue(column, value, item)}
                        </td>
                      );
                    })}

                    <td className="px-5 py-4">
                      <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-1
                            transition
                            duration-200
                            sm:opacity-50
                            sm:group-hover:opacity-100
                          "
                      >
                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          title={`تعديل ${entityName}`}
                          className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              bg-ink/[0.045]
                              text-ink/60
                              transition-all
                              hover:bg-ink/[0.08]
                              hover:text-ink
                              hover:scale-105
                            "
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          title={`حذف ${entityName}`}
                          className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              bg-red-50
                              text-red-400
                              transition-all
                              hover:bg-red-600
                              dark:hover:bg-red-500
                              hover:text-white
                              hover:scale-105
                            "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {filteredItems.length > 0 && totalPages > 1 && (
        <Card
          className={`
            border
            ${theme.borderSoft}
            bg-gradient-to-r
            from-gray-50/[0.6]
            via-card
            to-gray-50/[0.6]
            p-4
            shadow-none
          `}
        >
          <div
            className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
          >
            {/* INFO */}

            <div
              className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  text-ink/60
                  sm:justify-start
                "
            >
              <span>عرض</span>

              <span
                className={`
                  rounded-lg
                  px-2
                  py-1
                  font-black
                  ${theme.chip}
                `}
              >
                {Math.min(
                  (currentPage - 1) * pageSize + 1,
                  filteredItems.length,
                )}
              </span>

              <span>-</span>

              <span
                className="
                    rounded-lg
                    bg-ink/[0.06]
                    px-2
                    py-1
                    font-black
                    text-ink
                  "
              >
                {Math.min(currentPage * pageSize, filteredItems.length)}
              </span>

              <span>من</span>

              <span className="font-black text-ink/60">
                {filteredItems.length}
              </span>

              <span>{entityNamePlural}</span>
            </div>

            {/* CONTROLS */}

            <div
              className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                "
              dir="ltr"
            >
              {/* PREVIOUS */}

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    ${theme.borderSoft}
                    bg-card
                    ${theme.text}
                    transition-all
                    ${theme.searchHover}
                    disabled:pointer-events-none
                    disabled:opacity-30
                  `}
                aria-label="الصفحة السابقة"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* PAGE NUMBERS */}

              <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`dots-${index}`}
                        className={`
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              text-xs
                              font-bold
                              ${theme.textSoft}
                            `}
                      >
                        ...
                      </span>
                    );
                  }

                  const active = currentPage === page;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`
                            flex
                            h-9
                            min-w-9
                            items-center
                            justify-center
                            rounded-xl
                            px-2.5
                            text-xs
                            font-black
                            transition-all
                            cursor-pointer
                            ${
                              active
                                ? `${theme.solid} ${theme.solidText} shadow-md`
                                : `border ${theme.borderSoft} bg-card ${theme.text} ${theme.searchHover}`
                            }
                          `}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* NEXT */}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    ${theme.borderSoft}
                    bg-card
                    ${theme.text}
                    transition-all
                    ${theme.searchHover}
                    disabled:pointer-events-none
                    disabled:opacity-30
                  `}
                aria-label="الصفحة التالية"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* =====================================================
          MODAL
      ====================================================== */}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `تعديل ${entityName}` : `إضافة ${entityName} جديد`}
        footer={
          <div
            className="
              flex
              flex-col-reverse
              gap-2
              sm:flex-row
              sm:justify-end
            "
          >
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={saving}
              className={`
                rounded-xl
                border
                ${theme.borderSoft}
                ${theme.text}
                ${theme.chipHover}
              `}
            >
              إلغاء
            </Button>

            <Button
              onClick={handleSave}
              loading={saving}
              className={`
                rounded-xl
                ${theme.solid}
                ${theme.solidText}
                shadow-md
                ${theme.solidHover}
              `}
            >
              {editing ? "حفظ التعديلات" : `إضافة ${entityName}`}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="space-y-5 shadow-none">
          {/* =================================================
              MODAL INFO
          ================================================== */}

          <div
            className={`
              relative
              overflow-hidden
              rounded-2xl
              ${theme.solid}
              p-4
              shadow-none
            `}
          >
            <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/[0.06]" />

            <div className="pointer-events-none absolute -bottom-12 -right-8 h-24 w-24 rounded-full bg-black/[0.06]" />

            <div className="relative flex items-center gap-3">
              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  ${theme.textStrong}
                  shadow-sm
                `}
              >
                <EntityIcon className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {editing
                    ? `تعديل بيانات ${entityName}`
                    : `بيانات ${entityName}`}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-white/25
                      bg-white/15
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-white
                    `}
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50`}
                      />

                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full bg-white`}
                      />
                    </span>
                    اتصال مباشر
                  </span>

                  <span className="text-[11px] font-medium text-white/70">
                    Firestore • Real-time
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-white/70">
                  سيتم حفظ البيانات مباشرة في قاعدة البيانات ومزامنتها لحظيًا مع
                  لوحة التحكم.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              FIELDS
          ================================================== */}

          {fields.map(renderField)}
        </form>
      </Modal>
    </div>
  );
}
