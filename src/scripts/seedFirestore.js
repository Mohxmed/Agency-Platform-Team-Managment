import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../src/lib/firebase";

/*
============================================================
FIRESTORE SEED
============================================================

Creates:

20 Categories
20 Clients
20 Projects

Relations:

projects.categoryId -> categories document ID
============================================================
*/

const TOTAL = 20;

/* ============================================================
   STATIC DATA
============================================================ */

const categoryNames = [
  "هوية بصرية",
  "تصميم مواقع",
  "متاجر إلكترونية",
  "تصميم UI/UX",
  "سوشيال ميديا",
  "تصميم لوجو",
  "براندينج",
  "موشن جرافيك",
  "إعلانات",
  "تصميم مطبوعات",
  "تصميم تطبيقات",
  "تطوير مواقع",
  "تطوير متاجر",
  "تصميم بوسترات",
  "تصميم Packaging",
  "تصميم محتوى",
  "تصميم عروض تقديمية",
  "تصميم بنرات",
  "تصميم كتالوجات",
  "حلول رقمية",
];

const clientNames = [
  "Ammar Amer",
  "El Shetry",
  "Tech Vision",
  "Nova Academy",
  "Future Store",
  "Alpha Marketing",
  "Code House",
  "Smart Business",
  "Creative Hub",
  "Digital Zone",
  "Elite Academy",
  "Modern Furniture",
  "Golden Coffee",
  "Prime Medical",
  "Next Education",
  "Urban Fashion",
  "Vision Group",
  "Pro Services",
  "Business Plus",
  "Future Tech",
];

const specialties = [
  "مصمم جرافيك",
  "مطور مواقع",
  "مدرس",
  "رائد أعمال",
  "مسوق رقمي",
  "صاحب متجر",
  "شركة ناشئة",
  "صاحب مشروع",
];

const projectTitles = [
  "تصميم هوية بصرية متكاملة",
  "تصميم موقع إلكتروني احترافي",
  "تطوير متجر إلكتروني",
  "تصميم واجهة مستخدم",
  "إدارة الهوية الرقمية",
  "تصميم لوجو احترافي",
  "بناء هوية تجارية",
  "تصميم حملة إعلانية",
  "تصميم محتوى سوشيال ميديا",
  "تطوير منصة تعليمية",
  "تصميم تطبيق موبايل",
  "تصميم كتالوج منتجات",
  "تصميم Packaging احترافي",
  "تصميم Landing Page",
  "تطوير موقع شركة",
  "تصميم Dashboard",
  "تصميم منصة خدمات",
  "تصميم بوسترات إعلانية",
  "تصميم عروض تقديمية",
  "حلول رقمية متكاملة",
];

/* ============================================================
   HELPERS
============================================================ */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06ffa-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDate(daysAgo = 0) {
  const date = new Date();

  date.setDate(date.getDate() - daysAgo);

  date.setHours(randomNumber(8, 22), randomNumber(0, 59), randomNumber(0, 59));

  return date;
}

/* ============================================================
   CATEGORY SEED
============================================================ */

async function seedCategories() {
  console.log("\n📂 Creating categories...");

  const categoriesRef = collection(db, "categories");

  const existing = await getDocs(categoriesRef);

  if (!existing.empty) {
    console.log(`⚠️ categories already contains ${existing.size} documents.`);

    return existing.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  const categories = [];

  for (let i = 0; i < TOTAL; i++) {
    const name = categoryNames[i];

    const data = {
      name,

      description: `تصميم وتنفيذ خدمات ${name} بشكل احترافي يناسب احتياجات العملاء والمشاريع المختلفة.`,

      createdAt: createDate(randomNumber(1, 60)),
      updatedAt: createDate(randomNumber(0, 10)),
    };

    const docRef = await addDoc(categoriesRef, data);

    categories.push({
      id: docRef.id,
      ...data,
    });

    console.log(`✅ Category ${i + 1}/20: ${name}`);
  }

  return categories;
}

/* ============================================================
   CLIENT SEED
============================================================ */

async function seedClients() {
  console.log("\n👤 Creating clients...");

  const clientsRef = collection(db, "clients");

  const existing = await getDocs(clientsRef);

  if (!existing.empty) {
    console.log(`⚠️ clients already contains ${existing.size} documents.`);

    return existing.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  const clients = [];

  for (let i = 0; i < TOTAL; i++) {
    const name = clientNames[i];

    const link = `${slugify(name)}-${i + 1}`;

    const data = {
      Spe: `عميل تجريبي رقم ${i + 1}`,

      coverImage:
        "https://res.cloudinary.com/fij29l1m/image/upload/v1785294135/portfolio/clients/xpyjvfeb1ma9wk1cirxa.jpg",

      coverImageBytes: 195337,

      coverImageFormat: "jpg",

      coverImageHeight: 1280,

      coverImagePublicId: "portfolio/clients/xpyjvfeb1ma9wk1cirxa",

      coverImageResourceType: "image",

      coverImageWidth: 1280,

      createdAt: createDate(randomNumber(1, 90)),

      description: `نبذة تجريبية عن العميل ${name}. هذا السجل مخصص لاختبار الأداء والبحث والـ pagination والـ filtering.`,

      email: `client${i + 1}@example.com`,

      facebook: `https://facebook.com/test.client.${i + 1}`,

      instagram: `https://instagram.com/test.client.${i + 1}`,

      link,

      linkedin: `https://linkedin.com/in/test-client-${i + 1}`,

      logo: "https://res.cloudinary.com/fij29l1m/image/upload/v1785294123/portfolio/clients/w2edqoqrv6jcvxrnao3i.jpg",

      logoBytes: 125135,

      logoFormat: "jpg",

      logoHeight: 1280,

      logoPublicId: "portfolio/clients/w2edqoqrv6jcvxrnao3i",

      logoResourceType: "image",

      logoWidth: 1280,

      name,

      phone: `01000000${String(i + 1).padStart(3, "0")}`,

      specialty: randomItem(specialties),

      stats: [
        {
          label: "نزاهة",
          value: `${randomNumber(85, 99)}%`,
        },
        {
          label: "متابعين",
          value: `${randomNumber(1, 99)}k+`,
        },
        {
          label: "مشاريع",
          value: `${randomNumber(5, 50)}+`,
        },
      ],

      tiktok: `https://tiktok.com/@test.client.${i + 1}`,

      updatedAt: createDate(randomNumber(0, 5)),

      website: `client${i + 1}.com`,

      youtube: `https://youtube.com/@testclient${i + 1}`,
    };

    const docRef = await addDoc(clientsRef, data);

    clients.push({
      id: docRef.id,
      ...data,
    });

    console.log(`✅ Client ${i + 1}/20: ${name}`);
  }

  return clients;
}

/* ============================================================
   PROJECT SEED
============================================================ */

async function seedProjects(categories) {
  console.log("\n📁 Creating projects...");

  const projectsRef = collection(db, "projects");

  const existing = await getDocs(projectsRef);

  if (!existing.empty) {
    console.log(`⚠️ projects already contains ${existing.size} documents.`);

    return;
  }

  for (let i = 0; i < TOTAL; i++) {
    const category = categories[i % categories.length];

    const title = projectTitles[i];

    const data = {
      categoryId: category.id,

      createdAt: createDate(randomNumber(1, 120)),

      description: `مشروع تجريبي رقم ${i + 1}. ${title} تم إنشاؤه لاختبار نظام المشاريع والبحث والتصفية والـ pagination.`,

      gallery: [
        "https://res.cloudinary.com/fij29l1m/image/upload/v1785289479/portfolio/works/iwo08sxbyckxbgpkejny.png",
      ],

      image:
        "https://res.cloudinary.com/fij29l1m/image/upload/v1785289479/portfolio/works/iwo08sxbyckxbgpkejny.png",

      imageBytes: 5807975,

      imageFormat: "png",

      imageHeight: 2000,

      imagePublicId: "portfolio/works/iwo08sxbyckxbgpkejny",

      imageResourceType: "image",

      imageWidth: 2000,

      link: `${slugify(title)}-${i + 1}`,

      title,

      updatedAt: createDate(randomNumber(0, 7)),

      year: String(randomNumber(2022, 2026)),
    };

    await addDoc(projectsRef, data);

    console.log(`✅ Project ${i + 1}/20: ${title} → ${category.name}`);
  }
}

/* ============================================================
   MAIN
============================================================ */

async function seedDatabase() {
  try {
    console.log("============================================");
    console.log("🔥 FIRESTORE SEED STARTED");
    console.log("============================================");

    /*
     * 1. Categories
     */

    const categories = await seedCategories();

    /*
     * 2. Clients
     */

    await seedClients();

    /*
     * 3. Projects
     */

    await seedProjects(categories);

    console.log("\n============================================");
    console.log("🎉 FIRESTORE SEED COMPLETED");
    console.log("============================================");

    console.log(`
Created / verified:

📂 Categories: 20
👤 Clients:     20
📁 Projects:    20

Projects are linked to categories using:

projects.categoryId
        ↓
categories.id
`);
  } catch (error) {
    console.error("\n❌ SEED FAILED");
    console.error(error);
  }
}

seedDatabase();
