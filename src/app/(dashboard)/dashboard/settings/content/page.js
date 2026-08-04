"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Save,
  Sparkles,
  Share2,
  Mail,
  ChevronDown,
  Users,
  BriefcaseBusiness,
  LayoutGrid,
  Home,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  Play,
  Send,
  MessageCircle,
  Phone,
  Rocket,
  Heart,
  Star,
  GalleryVerticalEnd,
  MessageSquareHeart,
  TrendingUp,
  Eye,
  MapPin,
} from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import Input, { Textarea } from "@/features/dashboard/ui/Input";
import { SettingsCard, ToggleRow } from "@/features/dashboard/ui/SettingsCard";
import ImageUploadField from "@/features/dashboard/components/ImageUploadField";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";
import { DEFAULT_CONTENT } from "@/contexts/SettingsContext";

const defaults = { content: DEFAULT_CONTENT };

const ICON_OPTIONS = [
  { value: "ArrowLeft", label: "سهم لليسار", icon: ArrowLeft },
  { value: "ArrowRight", label: "سهم لليمين", icon: ArrowRight },
  { value: "ArrowUpLeft", label: "سهم لأعلى اليسار", icon: ArrowUpLeft },
  { value: "Play", label: "تشغيل", icon: Play },
  { value: "Send", label: "إرسال", icon: Send },
  { value: "MessageCircle", label: "محادثة", icon: MessageCircle },
  { value: "Mail", label: "بريد", icon: Mail },
  { value: "Phone", label: "هاتف", icon: Phone },
  { value: "Sparkles", label: "تألق", icon: Sparkles },
  { value: "Rocket", label: "صاروخ", icon: Rocket },
  { value: "Heart", label: "قلب", icon: Heart },
  { value: "Star", label: "نجمة", icon: Star },
  { value: "Users", label: "مستخدمون", icon: Users },
  { value: "BriefcaseBusiness", label: "حقيبة أعمال", icon: BriefcaseBusiness },
  { value: "GalleryVerticalEnd", label: "معرض", icon: GalleryVerticalEnd },
  { value: "MessageSquareHeart", label: "رسالة ودّية", icon: MessageSquareHeart },
  { value: "TrendingUp", label: "نمو", icon: TrendingUp },
  { value: "Eye", label: "عين", icon: Eye },
  { value: "MapPin", label: "موقع", icon: MapPin },
];

function getPath(obj, path) {
  const keys = path.split(".");
  let node = obj;
  for (const key of keys) {
    if (node == null) return "";
    node = node[key];
  }
  return node == null || node === "" ? "" : node;
}

function buildFooterLinkFields(columnKey, columnLabel) {
  const fields = [
    {
      path: `content.footer.${columnKey}Title`,
      label: `${columnLabel} - عنوان العمود`,
      type: "text",
    },
  ];

  for (let i = 0; i < 4; i++) {
    fields.push(
      {
        path: `content.footer.${columnKey}.${i}.label`,
        label: `الرابط ${i + 1} - النص`,
        type: "text",
      },
      {
        path: `content.footer.${columnKey}.${i}.href`,
        label: `الرابط ${i + 1} - الرابط`,
        type: "link",
      },
    );
  }

  return fields;
}

const groups = [
  {
    key: "hero",
    title: "الواجهة الرئيسية",
    description: "الشارة، العنوان، الأزرار والبطاقات العائمة في أول الصفحة.",
    icon: Sparkles,
    defaultOpen: true,
    sections: [
      {
        title: "النصوص الأساسية",
        fields: [
          { path: "content.hero.badge", label: "نص الشارة العلوية", type: "text" },
          { path: "content.hero.titlePrefix", label: "كلمة قبل الجزء المميز", type: "text" },
          { path: "content.hero.titleHighlight", label: "الجزء المميز من العنوان", type: "text" },
          { path: "content.hero.titleSuffix", label: "السطر الثاني من العنوان", type: "text" },
        ],
      },
      {
        title: "الزر الأساسي",
        fields: [
          { path: "content.hero.ctaPrimary", label: "نص الزر", type: "text" },
          { path: "content.hero.ctaPrimaryLink", label: "رابط الزر", type: "link" },
          { path: "content.hero.ctaPrimaryIcon", label: "أيقونة الزر", type: "icon" },
        ],
      },
      {
        title: "الزر الثانوي",
        fields: [
          { path: "content.hero.ctaSecondary", label: "نص الزر", type: "text" },
          { path: "content.hero.ctaSecondaryLink", label: "رابط الزر", type: "link" },
          { path: "content.hero.ctaSecondaryIcon", label: "أيقونة الزر", type: "icon" },
        ],
      },
      {
        title: "بطاقة الحملة التسويقية",
        fields: [
          { path: "content.hero.campaign.title", label: "عنوان البطاقة", type: "text" },
          { path: "content.hero.campaign.text", label: "نص البطاقة", type: "textarea" },
          { path: "content.hero.campaign.likes", label: "عدد الإعجابات", type: "text" },
          { path: "content.hero.campaign.comments", label: "عدد التعليقات", type: "text" },
          { path: "content.hero.campaign.logo", label: "شعار الشركة", type: "image" },
          { path: "content.hero.campaign.visible", label: "إظهار البطاقة", type: "toggle" },
        ],
      },
      {
        title: "بطاقة التحليلات",
        fields: [
          { path: "content.hero.analytics.title", label: "عنوان البطاقة", type: "text" },
          { path: "content.hero.analytics.growth", label: "نسبة النمو", type: "text" },
          { path: "content.hero.analytics.text", label: "نص البطاقة", type: "text" },
          { path: "content.hero.analytics.ring", label: "قيمة Progress Ring (0-100)", type: "number" },
          { path: "content.hero.analytics.chart", label: "قيم الرسم البياني (افصل بفاصلة)", type: "chart" },
          { path: "content.hero.analytics.live", label: "شارة LIVE", type: "toggle" },
          { path: "content.hero.analytics.visible", label: "إظهار البطاقة", type: "toggle" },
        ],
      },
      {
        title: "بطاقة النمو",
        fields: [
          { path: "content.hero.growth.value", label: "القيمة", type: "text" },
          { path: "content.hero.growth.label", label: "وصف القيمة", type: "text" },
          { path: "content.hero.growth.period", label: "الفترة", type: "text" },
          { path: "content.hero.growth.color", label: "لون البطاقة (Hex)", type: "color" },
          { path: "content.hero.growth.visible", label: "إظهار البطاقة", type: "toggle" },
        ],
      },
      {
        title: "الصاروخ",
        fields: [
          { path: "content.hero.rocket.visible", label: "إظهار الصاروخ", type: "toggle" },
          { path: "content.hero.rocket.image", label: "صورة الصاروخ", type: "image" },
          { path: "content.hero.rocket.speed", label: "السرعة (ثانية لكل دورة 18-25)", type: "number" },
          { path: "content.hero.rocket.size", label: "الحجم (بكسل 120-260)", type: "number" },
          { path: "content.hero.rocket.opacity", label: "الشفافية (0-1)", type: "number" },
          { path: "content.hero.rocket.glow", label: "قوة التوهج (0-1)", type: "number" },
        ],
      },
    ],
  },
  {
    key: "clients",
    title: "أبرز شركائنا",
    description: "نصوص قسم العملاء المميزين.",
    icon: Users,
    sections: [
      {
        title: "رأس القسم",
        fields: [
          { path: "content.clients.badge", label: "نص الشارة", type: "text" },
          { path: "content.clients.title", label: "العنوان الأول", type: "text" },
          { path: "content.clients.redTitle", label: "العنوان المميز", type: "text" },
          { path: "content.clients.description", label: "الوصف", type: "textarea" },
        ],
      },
      {
        title: "الأزرار",
        fields: [
          { path: "content.clients.ctaPrimary", label: "نص الزر الأول", type: "text" },
          { path: "content.clients.ctaPrimaryLink", label: "رابط الزر الأول", type: "link" },
          { path: "content.clients.ctaSecondary", label: "نص الزر الثاني", type: "text" },
          { path: "content.clients.ctaSecondaryLink", label: "رابط الزر الثاني", type: "link" },
        ],
      },
    ],
  },
  {
    key: "works",
    title: "أعمالنا",
    description: "نصوص قسم محفظة الأعمال وبانر الدعوة.",
    icon: BriefcaseBusiness,
    sections: [
      {
        title: "رأس القسم",
        fields: [
          { path: "content.works.badge", label: "نص الشارة", type: "text" },
          { path: "content.works.title", label: "العنوان الأول", type: "text" },
          { path: "content.works.redTitle", label: "العنوان المميز", type: "text" },
          { path: "content.works.description", label: "الوصف", type: "textarea" },
        ],
      },
      {
        title: "بانر الدعوة",
        fields: [
          { path: "content.works.ctaBadge", label: "نص الشارة", type: "text" },
          { path: "content.works.ctaHeading", label: "العنوان الأول", type: "text" },
          { path: "content.works.ctaHeadingHighlight", label: "العنوان المميز", type: "text" },
          { path: "content.works.ctaDescription", label: "الوصف", type: "textarea" },
          { path: "content.works.ctaPrimary", label: "نص الزر الأول", type: "text" },
          { path: "content.works.ctaPrimaryLink", label: "رابط الزر الأول", type: "link" },
          { path: "content.works.ctaSecondary", label: "نص الزر الثاني", type: "text" },
          { path: "content.works.ctaSecondaryLink", label: "رابط الزر الثاني", type: "link" },
        ],
      },
    ],
  },
  {
    key: "services",
    title: "خدماتنا",
    description: "نصوص قسم الخدمات وبطاقة المزيد.",
    icon: LayoutGrid,
    sections: [
      {
        title: "رأس القسم",
        fields: [
          { path: "content.services.badge", label: "نص الشارة", type: "text" },
          { path: "content.services.title", label: "العنوان الأول", type: "text" },
          { path: "content.services.redTitle", label: "العنوان المميز", type: "text" },
          { path: "content.services.description", label: "الوصف", type: "textarea" },
        ],
      },
      {
        title: "بطاقة المزيد",
        fields: [
          { path: "content.services.moreTitle", label: "عنوان البطاقة", type: "text" },
          { path: "content.services.moreDescription", label: "وصف البطاقة", type: "textarea" },
          { path: "content.services.moreLink", label: "رابط البطاقة", type: "link" },
        ],
      },
    ],
  },
  {
    key: "contact",
    title: "قسم التواصل",
    description: "نصوص قسم تواصل معنا والاستمارة.",
    icon: Mail,
    sections: [
      {
        title: "رأس القسم",
        fields: [
          { path: "content.contact.badgeTitle", label: "نص الشارة", type: "text" },
          { path: "content.contact.heading", label: "العنوان الرئيسي", type: "text" },
          { path: "content.contact.headingHighlight", label: "العنوان المميز", type: "text" },
          { path: "content.contact.description", label: "الوصف", type: "textarea" },
        ],
      },
      {
        title: "بيانات التواصل",
        fields: [
          { path: "content.contact.emailLabel", label: "عنوان البريد", type: "text" },
          { path: "content.contact.phoneLabel", label: "عنوان التليفون", type: "text" },
          { path: "content.contact.addressLabel", label: "عنوان المكان", type: "text" },
          { path: "content.contact.mapButton", label: "نص زر الخريطة", type: "text" },
          { path: "content.contact.whatsappButton", label: "نص زر الواتساب", type: "text" },
        ],
      },
      {
        title: "الاستمارة",
        fields: [
          { path: "content.contact.formTitle", label: "عنوان الاستمارة", type: "text" },
          { path: "content.contact.formSubtitle", label: "الوصف", type: "text" },
          { path: "content.contact.submitLabel", label: "نص زر الإرسال", type: "text" },
        ],
      },
    ],
  },
  {
    key: "social",
    title: "قسم السوشيال ميديا",
    description: "العنوان والنصوص الظاهرة في قسم تابعنا.",
    icon: Share2,
    sections: [
      {
        title: "النصوص",
        fields: [
          { path: "content.social.title", label: "العنوان العلوي", type: "text" },
          { path: "content.social.redTitle", label: "العنوان الرئيسي", type: "text" },
          { path: "content.social.description", label: "الوصف", type: "textarea" },
          { path: "content.social.bottomText", label: "النص السفلي", type: "text" },
        ],
      },
    ],
  },
  {
    key: "footer",
    title: "الفوتر",
    description: "وصف الفوتر وعناوين وأعمدة الروابط (بدون توقيع المطور).",
    icon: Home,
    sections: [
      {
        title: "الوصف",
        fields: [
          { path: "content.footer.description", label: "وصف الفوتر", type: "textarea" },
        ],
      },
      {
        title: "العمود الأول",
        fields: buildFooterLinkFields("column1Links", "العمود الأول"),
      },
      {
        title: "العمود الثاني",
        fields: buildFooterLinkFields("column2Links", "العمود الثاني"),
      },
    ],
  },
];

function IconPicker({ label, value, onChange }) {
  return (
    <div>
      <p className="mb-2 block text-sm font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {ICON_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              title={option.label}
              onClick={() => onChange(option.value)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-ink/[0.07] bg-card text-ink/40 hover:border-ink/20 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function parseChartInput(value) {
  return String(value)
    .split(",")
    .map((n) => Number(n.trim()))
    .filter((n) => !Number.isNaN(n));
}

function FieldGroup({ group, settings, updatePath }) {
  const [open, setOpen] = useState(!!group.defaultOpen);
  const Icon = group.icon;

  const renderControl = (field) => {
    const value = getPath(settings, field.path);
    let placeholder = getPath(DEFAULT_CONTENT, field.path);
    if (Array.isArray(placeholder)) placeholder = placeholder.join(", ");
    placeholder = placeholder || "";
    const change = (next) => updatePath(field.path, next);

    if (field.type === "toggle") {
      return (
        <ToggleRow
          title={field.label}
          checked={value !== false}
          onChange={(next) => change(next)}
        />
      );
    }

    if (field.type === "image") {
      return (
        <ImageUploadField
          label={field.label}
          value={value || ""}
          storagePath="hero"
          onChange={(image) => change(image)}
        />
      );
    }

    if (field.type === "chart") {
      return (
        <Input
          label={field.label}
          value={Array.isArray(value) ? value.join(", ") : value}
          placeholder={placeholder}
          dir="ltr"
          style={{ textAlign: "left" }}
          onChange={(e) => change(parseChartInput(e.target.value))}
        />
      );
    }

    if (field.type === "icon") {
      return <IconPicker label={field.label} value={value || placeholder} onChange={change} />;
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          label={field.label}
          value={value}
          placeholder={placeholder}
          onChange={(e) => change(e.target.value)}
          rows={3}
        />
      );
    }

    return (
      <Input
        label={field.label}
        value={value}
        placeholder={placeholder}
        type={field.type === "number" ? "number" : undefined}
        dir={field.type === "link" || field.type === "color" ? "ltr" : undefined}
        style={
          field.type === "link" || field.type === "color"
            ? { textAlign: "left" }
            : undefined
        }
        onChange={(e) => change(e.target.value)}
      />
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/[0.07] bg-[#fafafa] dark:bg-surface">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 p-4 text-right"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink/50">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-ink">{group.title}</h3>
          <p className="mt-0.5 text-[11px] leading-5 text-ink/40">{group.description}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink/35 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-6 border-t border-ink/[0.06] p-4">
          {group.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <p className="mb-3 text-[11px] font-black uppercase tracking-wide text-ink/35">
                  {section.title}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((field) => {
                  const isWide =
                    field.type === "textarea" ||
                    field.type === "toggle" ||
                    field.type === "image" ||
                    field.path.includes("campaign.text") ||
                    field.path.includes(".description");

                  return (
                    <div key={field.path} className={isWide ? "sm:col-span-2" : ""}>
                      {renderControl(field)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContentSettingsPage() {
  const { settings, loading, saving, load, save, updatePath } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard
      icon={FileText}
      title="المحتوى الثابت"
      description="نصوص أقسام الصفحة الرئيسية بالكامل — عدّل أي نص وهيظهر في الموقع فور الحفظ."
    >
      <div className="space-y-4">
        {groups.map((group) => (
          <FieldGroup
            key={group.key}
            group={group}
            settings={settings}
            updatePath={updatePath}
          />
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs leading-6 text-amber-700/70">
          اترك أي حقل فارغًا لاستخدام النص الافتراضي المدمج في الموقع.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">
          حفظ التغييرات
        </Button>
      </div>
    </SettingsCard>
  );
}
