# **Task Context**
We are building a frontend web application for the Syngenta Hackathon (Track 1: AI-Powered Agricultural Marketing at Scale). The goal is to deliver hyper-personalized agronomic marketing to smallholder farmers and provide a command center for Syngenta marketing teams. 

We must solve three critical rural realities:
1. Low bandwidth / offline environments.
2. Low literacy / feature phone constraints.
3. Scaling personalization autonomously without human effort.

# **Role**
You are an elite Staff Frontend Engineer specializing in Vue 3, Vite, and production-grade SaaS UI/UX. Your code is meticulous, highly performant, and visually on par with platforms like Stripe, Vercel, or Cursor. 

# **Objective**
Overhaul the provided basic Vue.js frontend prototype into a premium, production-ready, offline-first Progressive Web App (PWA). You will implement a high-density "Bento Box" dashboard for the Admin and an intuitive, mobile-responsive "Grower Pride" sharing tool for the farmers.

# **Design System & Architecture Rules**

## 1. Visual Language
- **Palette:** Zinc/Slate neutral tones for backgrounds and borders, with Syngenta Emerald Green (`#059669`) as the primary accent color.
- **Typography:** `Inter` or standard system fonts (`-apple-system`, `BlinkMacSystemFont`). High contrast, varying font weights (500, 600, 800) for hierarchy.
- **Layout:** "Bento Box" grids for dashboards. Rounded corners (`12px` or `16px`), subtle borders, and soft, performant drop shadows (`box-shadow`).
- **Interactions:** Snappy hover states on all interactive elements.

## 2. Technical Stack & Patterns
- **Framework:** Vue 3 using modern Composition API (`<script setup>`).
- **Build Tool:** Vite with `vite-plugin-pwa` for offline capabilities.
- **Icons:** `lucide-vue-next`.
- **Styling:** Vanilla CSS using CSS variables (no external CSS frameworks).
- **Native APIs:** `navigator.share()` (Web Share API) and HTML5 `<canvas>`.

# **File Implementation Guide**

## 1. frontend/vite.config.js (The Infrastructure)
- Install and configure `vite-plugin-pwa`.
- Set up a standard Web App Manifest (name: "TerraPlus AI", short_name: "TerraPlus", theme_color: "#ffffff").
- Configure Workbox to cache all `.{js,css,html,ico,png,svg}` files and heavily cache Google Fonts (`CacheFirst`).
- **Goal:** Ensure the app loads instantly in offline rural fields.

## 2. frontend/src/styles.css (The Foundation)
- Replace existing styles with a premium design system using CSS root variables.
- Create robust utility classes for the "Bento Box" grid layout (`.bento-grid`, `.col-span-2`, `.card`, `.card-header`).
- Implement beautiful, standard UI components (buttons, badges, progress bars).
- Remove all hardcoded "mobile shell mockups" from the previous design.

## 3. frontend/src/views/Admin.vue (The Command Center)
- Rebuild this page entirely using the new Bento Box CSS classes and a Sidebar layout.
- **Card 1 (Autonomous A/B Test):** Visualize Variant A vs Variant B. Show progress bars indicating the AI is automatically routing the majority of traffic (e.g., 85%) to the winning vernacular message.
- **Card 2 (Omni-Channel Delivery):** Show volume breakdown between WhatsApp (Rich Media), Voice IVR (Feature Phones), and SMS (Low Bandwidth).
- **Card 3 (Field Triggers):** A data table showing how digital AI engagement is autonomously dispatching physical field reps.
- **Goal:** Visually prove that the AI scales personalization without human intervention.

## 4. frontend/src/views/Selfie.vue (The Grower Pride Tool)
- Make the container fluid and beautifully responsive (remove the old 375x812 frame).
- Implement a sleek form to select "Crop" and "Trusted Brand".
- Allow file upload with smooth image drawing onto an HTML `<canvas>`. Apply a premium dark gradient overlay and Syngenta branding over the user's photo.
- **Web Share Integration:** Create a `shareViaNative` function that takes the canvas Blob and a pre-written AI vernacular text message, and triggers `navigator.share()`. 
- Provide a fallback to trigger a direct download and a `wa.me` link if the Web Share API is unsupported on the device.

# **Execution Rules**
- Write complete, functional code. DO NOT use placeholders like `// insert logic here` or `/* rest of code */`.
- Ensure all Vue components use modern `<script setup>` syntax.
- Do not modify the backend or routing logic; focus purely on UI, UX, and the PWA config.
- Treat this as a multi-million-dollar startup launch. The UI must look impeccable. Let's get to work!