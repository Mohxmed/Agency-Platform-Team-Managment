# Nokta

A modern digital marketing Arabic platform built with Next.js + Firebase as a PaaS.

---

## 📌 Overview

Nokta is a modern digital platform designed for a marketing agency to showcase services, manage projects, and organize digital content.

The platform helps brands, educators, and content creators build a stronger online presence through creative marketing solutions, content management, and digital experiences.

The project consists of two main parts:

- Public Website (Landing Page)
- Internal CMS Dashboard

---

# ✨ Features

## Public Website

- Modern responsive landing page
- Arabic-first RTL design
- English LTR support
- Services showcase
- Portfolio / Previous works
- Teachers and creators profiles
- Success stories
- Contact section
- Modern animations and interactions

## CMS Dashboard

- Content management
- Project management
- Team workflow management
- Teachers management
- Portfolio management
- Media management
- Authentication system

---

# 🛠 Tech Stack

## Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion

## Backend & Services

- Firebase
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage

## Development Tools

- Git
- GitHub
- Figma

---

# 🎨 Design System

The project follows a custom design system to maintain consistency between design and development.

The Design System includes:

- Color tokens
- Typography system
- Spacing system
- Border radius rules
- Shadows and elevation
- UI components
- Layout patterns
- Responsive guidelines

## Brand Identity

### Primary Color

```

Red
#D90429

```

### Secondary Color

```

Black
#0A0A0A

```

### Background

```

White
#FFFFFF

```

---

# 🔤 Typography

## Arabic

Font:

```

Bukra

```

Used for:

- Arabic headings
- Arabic content
- Buttons
- User interface

## English

Font:

```

Google Sans Flex

```

Used for:

- English content
- Numbers
- Technical terms

---

# 📁 Project Structure

```

src
│
├── app
│ ├── layout.js
│ ├── page.js
│ ├── globals.css
│ └── not-found.jsx
│
├── components
│ │
│ ├── ui
│ │ ├── Button.jsx
│ │ ├── Card.jsx
│ │ ├── Input.jsx
│ │ └── Modal.jsx
│ │
│ ├── layout
│ │ ├── Header.jsx
│ │ └── Footer.jsx
│ │
│ └── sections
│ ├── Hero.jsx
│ ├── Services.jsx
│ ├── Portfolio.jsx
│ └── Contact.jsx
│
├── assets
│ └── fonts
│
├── config
│
├── providers
│
├── lib
│
└── styles

```

---

# 🧩 Architecture

The project uses a scalable component-based architecture.

## Components

Reusable UI components:

- Buttons
- Cards
- Inputs
- Modals
- Forms

## Sections

Page-level sections:

- Hero
- Services
- Portfolio
- Testimonials
- Contact

The goal is to keep components reusable, maintainable, and easy to extend.

---

# 🌍 Localization

The application supports multiple languages.

## Arabic

```

/ar

```

Configuration:

- RTL direction
- Arabic typography
- Bukra font

## English

```

/en

```

Configuration:

- LTR direction
- English typography
- Google Sans Flex font

---

# 🔥 Firebase Structure

Main collections:

```

users

projects

tasks

teachers

works

testimonials

media

```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/Mohxmed/no2ta-platform
```

## Install dependencies

```bash
npm install
```

## Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# ⚙️ Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

# 📌 Development Guidelines

## Styling

- Use Tailwind CSS
- Follow Design System tokens
- Avoid random values
- Keep spacing and colors consistent

Example:

❌ Avoid:

```css
rounded-[23px]
```

✅ Use:

```css
rounded-card
```

---

## Components Rules

- Build reusable components
- Keep components focused on one responsibility
- Avoid duplicated UI code
- Follow the existing component structure

---

# 📦 Deployment

The project can be deployed using:

- Vercel
- Firebase Hosting
- Other Next.js compatible platforms

---

# 🔮 Future Improvements

- Advanced CMS features
- Analytics dashboard
- Role-based access control
- Content scheduling
- Notifications system
- Performance optimization
- Additional integrations

---

# 👨‍💻 Author

Mohamed Amr

Full Stack Developer
