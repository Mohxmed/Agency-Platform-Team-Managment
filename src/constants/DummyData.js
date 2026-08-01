import { BriefcaseBusiness, Palette, Globe2, Sparkles } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const teachers = [
  {
    id: 1,
    name: "أ. أحمد محمد",
    speciality: "مدرس الرياضيات",
    cover: "https://picsum.photos/id/1015/1200/600",
    avatar: "https://picsum.photos/id/1005/300/300",
    views: "12.8M",
    followers: "865K",
    students: "42K",
    youtube: "https://youtube.com/@ahmed",
    facebook: "https://facebook.com/ahmed",
    instagram: "https://instagram.com/ahmed",
    telegram: "https://t.me/ahmed",
    tiktok: "https://tiktok.com/@ahmed",
  },

  {
    id: 2,
    name: "د. سارة علي",
    speciality: "مدرسة الكيمياء",
    cover: "https://picsum.photos/id/1018/1200/600",
    avatar: "https://picsum.photos/id/1027/300/300",
    views: "8.5M",
    followers: "510K",
    students: "31K",
    youtube: "https://youtube.com/@sara",
    facebook: "https://facebook.com/sara",
    instagram: "https://instagram.com/sara",
    telegram: "https://t.me/sara",
    tiktok: "https://tiktok.com/@sara",
  },

  {
    id: 3,
    name: "أ. محمود حسن",
    speciality: "مدرس الفيزياء",
    cover: "https://picsum.photos/id/1019/1200/600",
    avatar: "https://picsum.photos/id/1011/300/300",
    views: "15.2M",
    followers: "1.1M",
    students: "58K",
    youtube: "https://youtube.com/@mahmoud",
    facebook: "https://facebook.com/mahmoud",
    instagram: "https://instagram.com/mahmoud",
    telegram: "https://t.me/mahmoud",
    tiktok: "https://tiktok.com/@mahmoud",
  },

  {
    id: 4,
    name: "أ. نور خالد",
    speciality: "مدرسة اللغة الإنجليزية",
    cover: "https://picsum.photos/id/1043/1200/600",
    avatar: "https://picsum.photos/id/1001/300/300",
    views: "9.7M",
    followers: "720K",
    students: "36K",
    youtube: "https://youtube.com/@nour",
    facebook: "https://facebook.com/nour",
    instagram: "https://instagram.com/nour",
    telegram: "https://t.me/nour",
    tiktok: "https://tiktok.com/@nour",
  },

  {
    id: 5,
    name: "أ. كريم إبراهيم",
    speciality: "مدرس اللغة العربية",
    cover: "https://picsum.photos/id/1020/1200/600",
    avatar: "https://picsum.photos/id/1009/300/300",
    views: "6.4M",
    followers: "385K",
    students: "24K",
    youtube: "https://youtube.com/@karim",
    facebook: "https://facebook.com/karim",
    instagram: "https://instagram.com/karim",
    telegram: "https://t.me/karim",
    tiktok: "https://tiktok.com/@karim",
  },

  {
    id: 6,
    name: "د. منة أحمد",
    speciality: "مدرسة الأحياء",
    cover: "https://picsum.photos/id/1024/1200/600",
    avatar: "https://picsum.photos/id/1012/300/300",
    views: "11.3M",
    followers: "640K",
    students: "39K",
    youtube: "https://youtube.com/@menna",
    facebook: "https://facebook.com/menna",
    instagram: "https://instagram.com/menna",
    telegram: "https://t.me/menna",
    tiktok: "https://tiktok.com/@menna",
  },

  {
    id: 7,
    name: "أ. يوسف سامح",
    speciality: "مدرس التاريخ",
    cover: "https://picsum.photos/id/1036/1200/600",
    avatar: "https://picsum.photos/id/1013/300/300",
    views: "5.9M",
    followers: "330K",
    students: "21K",
    youtube: "https://youtube.com/@youssef",
    facebook: "https://facebook.com/youssef",
    instagram: "https://instagram.com/youssef",
    telegram: "https://t.me/youssef",
    tiktok: "https://tiktok.com/@youssef",
  },

  {
    id: 8,
    name: "د. ريم مصطفى",
    speciality: "مدرسة الجغرافيا",
    cover: "https://picsum.photos/id/1039/1200/600",
    avatar: "https://picsum.photos/id/1016/300/300",
    views: "7.8M",
    followers: "475K",
    students: "28K",
    youtube: "https://youtube.com/@reem",
    facebook: "https://facebook.com/reem",
    instagram: "https://instagram.com/reem",
    telegram: "https://t.me/reem",
    tiktok: "https://tiktok.com/@reem",
  },

  {
    id: 9,
    name: "أ. عمر خالد",
    speciality: "مدرس البرمجة",
    cover: "https://picsum.photos/id/1040/1200/600",
    avatar: "https://picsum.photos/id/1025/300/300",
    views: "18.6M",
    followers: "1.3M",
    students: "74K",
    youtube: "https://youtube.com/@omar",
    facebook: "https://facebook.com/omar",
    instagram: "https://instagram.com/omar",
    telegram: "https://t.me/omar",
    tiktok: "https://tiktok.com/@omar",
  },

  {
    id: 10,
    name: "أ. يارا محمد",
    speciality: "مدرسة اللغة الفرنسية",
    cover: "https://picsum.photos/id/1041/1200/600",
    avatar: "https://picsum.photos/id/1021/300/300",
    views: "4.7M",
    followers: "290K",
    students: "18K",
    youtube: "https://youtube.com/@yara",
    facebook: "https://facebook.com/yara",
    instagram: "https://instagram.com/yara",
    telegram: "https://t.me/yara",
    tiktok: "https://tiktok.com/@yara",
  },

  {
    id: 11,
    name: "د. زياد أحمد",
    speciality: "مدرس الإحصاء",
    cover: "https://picsum.photos/id/1042/1200/600",
    avatar: "https://picsum.photos/id/1006/300/300",
    views: "10.5M",
    followers: "590K",
    students: "34K",
    youtube: "https://youtube.com/@ziad",
    facebook: "https://facebook.com/ziad",
    instagram: "https://instagram.com/ziad",
    telegram: "https://t.me/ziad",
    tiktok: "https://tiktok.com/@ziad",
  },

  {
    id: 12,
    name: "أ. ليان محمود",
    speciality: "مدرسة علم النفس",
    cover: "https://picsum.photos/id/1044/1200/600",
    avatar: "https://picsum.photos/id/1022/300/300",
    views: "13.1M",
    followers: "810K",
    students: "47K",
    youtube: "https://youtube.com/@layan",
    facebook: "https://facebook.com/layan",
    instagram: "https://instagram.com/layan",
    telegram: "https://t.me/layan",
    tiktok: "https://tiktok.com/@layan",
  },
];

export const projects = [
  {
    id: 1,
    title: "أستاذ سعد الدين - كيمياء",
    category: "تعليم",
    description:
      "بناء حضور رقمي متكامل لمدرس الكيمياء من خلال الهوية البصرية وإدارة منصات التواصل وصناعة المحتوى التعليمي.",
    image: "https://picsum.photos/1200/800?random=1",
    gallery: [
      "https://picsum.photos/1200/800?random=101",
      "https://picsum.photos/1200/800?random=102",
      "https://picsum.photos/1200/800?random=103",
      "https://picsum.photos/1200/800?random=104",
      "https://picsum.photos/1200/800?random=105",
    ],
    year: "2026",
    stats: [
      { label: "الوصول", value: "520K+" },
      { label: "المتابعين", value: "14K+" },
      { label: "النمو", value: "320%" },
    ],
  },

  {
    id: 2,
    title: "أكاديمية المستقبل",
    category: "تعليم",
    description:
      "تطوير الهوية الرقمية لأكاديمية تعليمية مع تصميم المحتوى وإدارة حضورها على منصات التواصل.",
    image: "https://picsum.photos/1200/800?random=2",
    gallery: [
      "https://picsum.photos/1200/800?random=106",
      "https://picsum.photos/1200/800?random=107",
      "https://picsum.photos/1200/800?random=108",
      "https://picsum.photos/1200/800?random=109",
    ],
    year: "2026",
    stats: [
      { label: "طلاب", value: "18K+" },
      { label: "وصول", value: "780K+" },
      { label: "تفاعل", value: "42%" },
    ],
  },

  {
    id: 3,
    title: "مطاحن بن الشتري",
    category: "هوية بصرية",
    description:
      "تصميم هوية بصرية متكاملة لعلامة تجارية متخصصة في القهوة مع تطوير العناصر الدعائية والتغليف.",
    image: "https://picsum.photos/1200/800?random=3",
    gallery: [
      "https://picsum.photos/1200/800?random=110",
      "https://picsum.photos/1200/800?random=111",
      "https://picsum.photos/1200/800?random=112",
      "https://picsum.photos/1200/800?random=113",
      "https://picsum.photos/1200/800?random=114",
    ],
    year: "2025",
    stats: [
      { label: "هوية", value: "100%" },
      { label: "تصميم", value: "35+" },
      { label: "تطبيقات", value: "18" },
    ],
  },

  {
    id: 4,
    title: "دار الهندسية",
    category: "هوية بصرية",
    description:
      "إعادة بناء الهوية البصرية لشركة عقارية وتطوير نظام بصري موحد للاستخدام الرقمي والمطبوع.",
    image: "https://picsum.photos/1200/800?random=4",
    gallery: [
      "https://picsum.photos/1200/800?random=115",
      "https://picsum.photos/1200/800?random=116",
      "https://picsum.photos/1200/800?random=117",
      "https://picsum.photos/1200/800?random=118",
    ],
    year: "2025",
    stats: [
      { label: "هوية", value: "100%" },
      { label: "تطبيق", value: "28+" },
      { label: "Brand Assets", value: "40+" },
    ],
  },

  {
    id: 5,
    title: "كافيه 27",
    category: "سوشيال ميديا",
    description:
      "إدارة المحتوى الرقمي وتصميم الهوية البصرية لمنصات التواصل بهدف بناء مجتمع رقمي نشط حول العلامة.",
    image: "https://picsum.photos/1200/800?random=5",
    gallery: [
      "https://picsum.photos/1200/800?random=119",
      "https://picsum.photos/1200/800?random=120",
      "https://picsum.photos/1200/800?random=121",
      "https://picsum.photos/1200/800?random=122",
      "https://picsum.photos/1200/800?random=123",
    ],
    year: "2026",
    stats: [
      { label: "Reach", value: "1.2M+" },
      { label: "تفاعل", value: "68K+" },
      { label: "نمو", value: "210%" },
    ],
  },

  {
    id: 6,
    title: "نور للتجميل",
    category: "سوشيال ميديا",
    description:
      "إعادة تقديم العلامة التجارية على منصات التواصل من خلال استراتيجية محتوى مرئية ومتناسقة.",
    image: "https://picsum.photos/1200/800?random=6",
    gallery: [
      "https://picsum.photos/1200/800?random=124",
      "https://picsum.photos/1200/800?random=125",
      "https://picsum.photos/1200/800?random=126",
      "https://picsum.photos/1200/800?random=127",
    ],
    year: "2025",
    stats: [
      { label: "متابعين", value: "32K+" },
      { label: "وصول", value: "950K+" },
      { label: "Engagement", value: "12.4%" },
    ],
  },

  {
    id: 7,
    title: "حملة صيفك أحلى",
    category: "حملات إعلانية",
    description:
      "إطلاق حملة إعلانية موسمية متكاملة تجمع بين التصميم الإبداعي والإعلانات الرقمية وصناعة المحتوى.",
    image: "https://picsum.photos/1200/800?random=7",
    gallery: [
      "https://picsum.photos/1200/800?random=128",
      "https://picsum.photos/1200/800?random=129",
      "https://picsum.photos/1200/800?random=130",
      "https://picsum.photos/1200/800?random=131",
      "https://picsum.photos/1200/800?random=132",
    ],
    year: "2026",
    stats: [
      { label: "Reach", value: "2.4M+" },
      { label: "CTR", value: "7.8%" },
      { label: "Leads", value: "4.2K" },
    ],
  },

  {
    id: 8,
    title: "حملة افتح بابك",
    category: "حملات إعلانية",
    description:
      "حملة إعلانية عقارية ركزت على تحويل الرسالة التسويقية إلى محتوى بصري مباشر وسهل التذكر.",
    image: "https://picsum.photos/1200/800?random=8",
    gallery: [
      "https://picsum.photos/1200/800?random=133",
      "https://picsum.photos/1200/800?random=134",
      "https://picsum.photos/1200/800?random=135",
      "https://picsum.photos/1200/800?random=136",
    ],
    year: "2025",
    stats: [
      { label: "Impressions", value: "3.1M" },
      { label: "Leads", value: "2.8K" },
      { label: "CTR", value: "6.2%" },
    ],
  },

  {
    id: 9,
    title: "بودكاست مساحة",
    category: "صناعة محتوى",
    description:
      "تطوير الهوية البصرية والاستراتيجية التحريرية لبودكاست يهتم بقصص وتجارب الشباب.",
    image: "https://picsum.photos/1200/800?random=9",
    gallery: [
      "https://picsum.photos/1200/800?random=137",
      "https://picsum.photos/1200/800?random=138",
      "https://picsum.photos/1200/800?random=139",
      "https://picsum.photos/1200/800?random=140",
      "https://picsum.photos/1200/800?random=141",
    ],
    year: "2026",
    stats: [
      { label: "حلقات", value: "24" },
      { label: "مشاهدات", value: "680K+" },
      { label: "تفاعل", value: "54K+" },
    ],
  },

  {
    id: 10,
    title: "محتوى Tech بالعربي",
    category: "صناعة محتوى",
    description:
      "بناء نظام محتوى تعليمي متخصص في التكنولوجيا مع تطوير الأسلوب البصري للمحتوى.",
    image: "https://picsum.photos/1200/800?random=10",
    gallery: [
      "https://picsum.photos/1200/800?random=142",
      "https://picsum.photos/1200/800?random=143",
      "https://picsum.photos/1200/800?random=144",
      "https://picsum.photos/1200/800?random=145",
    ],
    year: "2025",
    stats: [
      { label: "مشاهدات", value: "1.8M+" },
      { label: "فيديو", value: "86" },
      { label: "نمو", value: "240%" },
    ],
  },

  {
    id: 11,
    title: "حكاية براند",
    category: "فيديو",
    description:
      "إنتاج سلسلة فيديوهات قصيرة تحكي قصة العلامة التجارية بطريقة بصرية حديثة ومناسبة لمنصات التواصل.",
    image: "https://picsum.photos/1200/800?random=11",
    gallery: [
      "https://picsum.photos/1200/800?random=146",
      "https://picsum.photos/1200/800?random=147",
      "https://picsum.photos/1200/800?random=148",
      "https://picsum.photos/1200/800?random=149",
      "https://picsum.photos/1200/800?random=150",
    ],
    year: "2026",
    stats: [
      { label: "فيديو", value: "18" },
      { label: "مشاهدات", value: "920K+" },
      { label: "Shares", value: "31K+" },
    ],
  },

  {
    id: 12,
    title: "قنوات تعليمية متعددة",
    category: "فيديو",
    description:
      "إنتاج وتطوير فيديوهات تعليمية قصيرة وطويلة مع التركيز على الهوية البصرية واستمرارية المحتوى.",
    image: "https://picsum.photos/1200/800?random=12",
    gallery: [
      "https://picsum.photos/1200/800?random=151",
      "https://picsum.photos/1200/800?random=152",
      "https://picsum.photos/1200/800?random=153",
      "https://picsum.photos/1200/800?random=154",
    ],
    year: "2025",
    stats: [
      { label: "فيديو", value: "64" },
      { label: "مشاهدات", value: "2.1M+" },
      { label: "Subscribers", value: "42K+" },
    ],
  },

  {
    id: 13,
    title: "Grow Business",
    category: "تسويق رقمي",
    description:
      "بناء استراتيجية تسويق رقمي متكاملة لزيادة الوعي بالعلامة وتحويل الزيارات إلى عملاء.",
    image: "https://picsum.photos/1200/800?random=13",
    gallery: [
      "https://picsum.photos/1200/800?random=155",
      "https://picsum.photos/1200/800?random=156",
      "https://picsum.photos/1200/800?random=157",
      "https://picsum.photos/1200/800?random=158",
      "https://picsum.photos/1200/800?random=159",
    ],
    year: "2026",
    stats: [
      { label: "Sales", value: "1.2K+" },
      { label: "ROAS", value: "4.8x" },
      { label: "Reach", value: "3.6M" },
    ],
  },

  {
    id: 14,
    title: "Real Estate Growth",
    category: "تسويق رقمي",
    description:
      "إدارة الحملات الرقمية لشركة عقارية مع تحسين الاستهداف وتحويل الميزانية إلى نتائج قابلة للقياس.",
    image: "https://picsum.photos/1200/800?random=14",
    gallery: [
      "https://picsum.photos/1200/800?random=160",
      "https://picsum.photos/1200/800?random=161",
      "https://picsum.photos/1200/800?random=162",
      "https://picsum.photos/1200/800?random=163",
    ],
    year: "2025",
    stats: [
      { label: "Leads", value: "5.4K" },
      { label: "CPL", value: "-38%" },
      { label: "ROAS", value: "5.2x" },
    ],
  },

  {
    id: 15,
    title: "Minimal Coffee",
    category: "تصميم إبداعي",
    description:
      "تطوير مجموعة من التصاميم الإبداعية التي تعكس شخصية العلامة التجارية بأسلوب بصري بسيط وحديث.",
    image: "https://picsum.photos/1200/800?random=15",
    gallery: [
      "https://picsum.photos/1200/800?random=164",
      "https://picsum.photos/1200/800?random=165",
      "https://picsum.photos/1200/800?random=166",
      "https://picsum.photos/1200/800?random=167",
      "https://picsum.photos/1200/800?random=168",
    ],
    year: "2026",
    stats: [
      { label: "تصميم", value: "42+" },
      { label: "Campaigns", value: "8" },
      { label: "Formats", value: "12" },
    ],
  },

  {
    id: 16,
    title: "Urban Space",
    category: "تصميم إبداعي",
    description:
      "مجموعة تصاميم إبداعية لحملة عقارية تجمع بين الجرأة البصرية والوضوح التسويقي.",
    image: "https://picsum.photos/1200/800?random=16",
    gallery: [
      "https://picsum.photos/1200/800?random=169",
      "https://picsum.photos/1200/800?random=170",
      "https://picsum.photos/1200/800?random=171",
      "https://picsum.photos/1200/800?random=172",
    ],
    year: "2025",
    stats: [
      { label: "Designs", value: "56+" },
      { label: "Ads", value: "24" },
      { label: "Formats", value: "15" },
    ],
  },

  {
    id: 17,
    title: "أستاذ محمود - فيزياء",
    category: "تعليم",
    description:
      "تطوير الهوية الرقمية لمدرس الفيزياء وتحويل المحتوى التعليمي إلى تجربة بصرية أكثر جاذبية.",
    image: "https://picsum.photos/1200/800?random=17",
    gallery: [
      "https://picsum.photos/1200/800?random=173",
      "https://picsum.photos/1200/800?random=174",
      "https://picsum.photos/1200/800?random=175",
      "https://picsum.photos/1200/800?random=176",
    ],
    year: "2026",
    stats: [
      { label: "مشاهدات", value: "1.5M+" },
      { label: "طلاب", value: "58K+" },
      { label: "نمو", value: "290%" },
    ],
  },

  {
    id: 18,
    title: "Launch Campaign",
    category: "حملات إعلانية",
    description:
      "إطلاق حملة رقمية لمنتج جديد من خلال محتوى بصري متكامل وحملات مدفوعة متعددة المنصات.",
    image: "https://picsum.photos/1200/800?random=18",
    gallery: [
      "https://picsum.photos/1200/800?random=177",
      "https://picsum.photos/1200/800?random=178",
      "https://picsum.photos/1200/800?random=179",
      "https://picsum.photos/1200/800?random=180",
      "https://picsum.photos/1200/800?random=181",
    ],
    year: "2026",
    stats: [
      { label: "Reach", value: "4.2M+" },
      { label: "CTR", value: "8.4%" },
      { label: "Sales", value: "1.2K+" },
    ],
  },

  {
    id: 19,
    title: "Brand Motion",
    category: "فيديو",
    description:
      "تصميم وإنتاج مجموعة من فيديوهات الموشن جرافيك التي تشرح الخدمات والمنتجات بشكل مبسط.",
    image: "https://picsum.photos/1200/800?random=19",
    gallery: [
      "https://picsum.photos/1200/800?random=182",
      "https://picsum.photos/1200/800?random=183",
      "https://picsum.photos/1200/800?random=184",
      "https://picsum.photos/1200/800?random=185",
    ],
    year: "2025",
    stats: [
      { label: "فيديو", value: "22" },
      { label: "مشاهدات", value: "1.1M+" },
      { label: "Retention", value: "74%" },
    ],
  },

  {
    id: 20,
    title: "Social Growth Lab",
    category: "سوشيال ميديا",
    description:
      "إدارة وتطوير الحضور الرقمي لعلامة تجارية ناشئة من خلال استراتيجية محتوى مرنة ومستمرة.",
    image: "https://picsum.photos/1200/800?random=20",
    gallery: [
      "https://picsum.photos/1200/800?random=186",
      "https://picsum.photos/1200/800?random=187",
      "https://picsum.photos/1200/800?random=188",
      "https://picsum.photos/1200/800?random=189",
      "https://picsum.photos/1200/800?random=190",
    ],
    year: "2026",
    stats: [
      { label: "Followers", value: "85K+" },
      { label: "Reach", value: "2.7M+" },
      { label: "Growth", value: "185%" },
    ],
  },
];

export const stats = [
  {
    value: "120+",
    label: "مشروع مكتمل",
    icon: BriefcaseBusiness,
  },
  {
    value: "48",
    label: "هوية تجارية",
    icon: Palette,
  },
  {
    value: "3",
    label: "دول وصلنا لها",
    icon: Globe2,
  },
  {
    value: "99%",
    label: "رضا العملاء",
    icon: Sparkles,
  },
];

export const socialLinks = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    link: "#",
    shareLink: "#",
  },
  {
    name: "Whatsapp",
    icon: FaWhatsapp,
    link: "#",
    shareLink: "#",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    link: "#",
    shareLink: "#",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    link: "#",
    shareLink: "#",
  },
  {
    name: "Youtube",
    icon: FaYoutube,
    link: "#",
    shareLink: "#",
  },
  {
    name: "Twitter",
    icon: FaXTwitter,
    link: "#",
    shareLink: "#",
  },
];
