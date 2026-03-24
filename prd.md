# Product Requirements Document — Hár & Förðun MVP Website

**Domain:** harogfordun.is
**Version:** 1.0 — MVP
**Date:** February 28, 2026
**Stack:** Vite + React 18 · TypeScript · CSS Modules

---

## 1. Project Overview

### 1.1 Company Description

Hár & Förðun is a premium Icelandic mobile beauty service specializing in professional hair styling and makeup artistry. The company provides on-location services for weddings (brúðkaup), confirmations (fermingar), annual festivals (árshátíðir), gala evenings (galakvöld), film/TV productions (kvikmyndir), and commercial advertising shoots (auglýsingar). A team of professional stylists and makeup artists travels to the client's chosen location anywhere in Iceland.

### 1.2 Project Goal

Build a single-page marketing website that matches the provided design mockup pixel-perfectly. The site must communicate luxury, professionalism, and warmth while serving as the primary lead generation tool through an integrated inquiry form. The entire website is in Icelandic.

### 1.3 Target Audience

- Brides and wedding planners seeking on-location bridal beauty services
- Event organizers for corporate galas, annual celebrations, and private parties
- Production companies needing hair/makeup for film, TV, and advertising
- Individuals preparing for confirmations and other milestone celebrations

### 1.4 Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| Vite | Build tool and dev server | 5.x |
| React | UI component library | 18.x |
| TypeScript | Type safety across codebase | 5.x |
| CSS Modules | Scoped component styling (`.module.css`) | Built-in |
| React Hook Form | Form state management and validation | 7.x |
| Framer Motion | Subtle scroll animations and transitions | 11.x |
| Lucide React | Consistent iconography | Latest |

### 1.5 Scope

**In Scope:** Single-page website, inquiry form with client-side validation, responsive design (mobile-first), image gallery, testimonial display, SEO metadata, smooth scroll navigation, subtle animations.

**Out of Scope (Post-MVP):** CMS integration, booking/payment system, blog, multi-language support, admin dashboard, email service backend integration.

---

## 2. Design System & Visual Language

### 2.1 Color Palette

Define as CSS custom properties in `src/styles/variables.css` and import into modules as needed.

| Token | CSS Variable | Hex Value | Usage |
|---|---|---|---|
| Primary Gold | `--color-gold` | `#B8860B` | Headings, buttons, accents, borders, decorative lines |
| Gold Hover | `--color-gold-hover` | `#996F09` | Button hover states |
| Gold Light | `--color-gold-light` | `#D4A843` | Subtle highlights, icon backgrounds |
| Cream | `--color-cream` | `#FDF8F0` | Main page background |
| Cream Dark | `--color-cream-dark` | `#F5EDE0` | Alternating section backgrounds |
| White | `--color-white` | `#FFFFFF` | Cards, form inputs, elevated surfaces |
| Text Dark | `--color-text-dark` | `#2C2C2C` | Primary body text, headings |
| Text Medium | `--color-text-medium` | `#666666` | Secondary text, descriptions |
| Text Light | `--color-text-light` | `#999999` | Placeholder text, subtle labels |
| Border Gold | `--color-border-gold` | `#D4A843` | Card borders, decorative lines |
| Border Light | `--color-border-light` | `#E8E0D0` | Input field borders, subtle dividers |

```css
/* src/styles/variables.css */
:root {
  --color-gold: #B8860B;
  --color-gold-hover: #996F09;
  --color-gold-light: #D4A843;
  --color-cream: #FDF8F0;
  --color-cream-dark: #F5EDE0;
  --color-white: #FFFFFF;
  --color-text-dark: #2C2C2C;
  --color-text-medium: #666666;
  --color-text-light: #999999;
  --color-border-gold: #D4A843;
  --color-border-light: #E8E0D0;

  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;

  --max-width: 1200px;
  --navbar-height: 72px;
}
```

### 2.2 Typography

Load fonts via Google Fonts `<link>` in `index.html`. Request weights: Playfair Display 400, 400i, 600, 700, 700i; Inter 400, 500, 600.

| Element | Font | Weight | Size (Desktop) | Transform |
|---|---|---|---|---|
| Site Logo / Brand | Playfair Display | 700 Italic | 28px | None (stylized) |
| Hero Title (Hár & Förðun) | Playfair Display | 700 Italic | 48–56px | None |
| Hero Subtitle | Playfair Display | 400 Italic | 28–32px | Uppercase |
| Section Headings | Playfair Display | 600 | 28–32px | Uppercase + letter-spacing: 0.15em |
| Card Headings | Playfair Display | 700 | 18–20px | Uppercase + letter-spacing: 0.1em |
| Body Text | Inter | 400 | 16px | None |
| Button Text | Inter | 600 | 14–16px | Uppercase + letter-spacing: 0.15em |
| Navigation Links | Inter | 500 | 13–14px | Uppercase + letter-spacing: 0.1em |
| Footer Text | Inter | 400 | 13–14px | None |
| Step Numbers | Playfair Display | 400 | 24px | None |

### 2.3 Spacing & Layout

- Max content width: 1200px, centered with `margin: 0 auto`
- Section vertical padding: 80px top / 80px bottom (desktop), 48px (mobile)
- Card gap: 24–32px between service cards
- Component internal padding: 24–32px
- Standard border-radius: 0px for cards (sharp, elegant), 4px for buttons and inputs

### 2.4 Visual Style Rules

- Gold decorative horizontal lines (1px) flanking section headings — achieved with CSS `::before` and `::after` pseudo-elements using `display: flex` layout on the heading wrapper
- Cards have a subtle 1px gold/tan border with no box-shadow for a clean, elegant look
- Buttons (primary): Gold background (`#B8860B`) with white uppercase text, letter-spacing, 4px border-radius. Hover darkens to `#996F09`
- Buttons (secondary/outline): Transparent background with 1px gold border and gold text. Hover fills with gold background, text switches to white
- Testimonial section uses an oversized curly quote mark `"` in gold as a decorative element
- Image treatment: All images use `object-fit: cover`

---

## 3. Site Architecture & Navigation

### 3.1 Single-Page Structure

The website is a single-page application using smooth scroll navigation. Each section is identified by an anchor ID:

| Order | Section ID | Section Name (IS) | Nav Label |
|---|---|---|---|
| 1 | `#top` | Header / Navigation | — |
| 2 | `#hero` | Hero Banner | — |
| 3 | `#thjonusta` | Þjónusta (Services) | ÞJÓNUSTA |
| 4 | `#svona-virkum-vid` | Svona Virkum Við (How We Work) | — |
| 5 | `#myndir` | Myndir af Verkum Okkar (Gallery) | MYNDIR |
| 6 | `#umsagnir` | Viðskiptavinir Segja + Form | HAFÐU SAMBAND |
| 7 | `#footer` | Footer | — |

### 3.2 Navigation Bar

- **Left:** Brand logo text "harogfordun.is" in Playfair Display italic gold script
- **Right:** Navigation links — UM OKKUR · ÞJÓNUSTA · MYNDIR · HAFÐU SAMBAND
- **Far right:** CTA button "FÁ TILBOÐ" — gold background, white text, links to `#umsagnir` form
- **Background:** White with subtle bottom shadow (`box-shadow: 0 1px 3px rgba(0,0,0,0.08)`)
- **Height:** 64–72px
- **Position:** `position: sticky; top: 0; z-index: 100`

### 3.3 Smooth Scroll Behavior

All navigation links use smooth scroll. Set `scroll-behavior: smooth` on `html`. Each target section applies `scroll-margin-top: var(--navbar-height)` to offset the sticky navbar.

---

## 4. Section-by-Section Specification

### 4.1 Hero Section (`#hero`)

The hero is a full-width banner occupying approximately 70–80vh on desktop.

**Layout & Background:**
- Full-width container with a large hero image as background (woman getting makeup applied, warm/golden lighting)
- `background-size: cover; background-position: center right`
- Subtle dark gradient overlay from left to right (`linear-gradient(to right, rgba(0,0,0,0.3), transparent)`) for text readability

**Text Content (left-aligned, vertically centered):**
- Line 1: "Hár & Förðun" — Playfair Display, 48–56px, italic, bold, white, `text-shadow: 0 2px 8px rgba(0,0,0,0.3)`
- Line 2: "FYRIR STÓRU STUNDIRNAR" — Playfair Display, 28–32px, italic, white, uppercase, `letter-spacing: 0.1em`
- Line 3: "Brúðkaup • Viðburðir • Kvikmyndir & Auglýsingar á Íslandi" — Inter, 16px, white/cream

**CTA Buttons (horizontal row below text, 16px gap):**
- "FÁ TILBOÐ" — Gold filled (`#B8860B` bg, white text). Hover: `#996F09`
- "SJÁ MYNDIR" — Outline (transparent bg, white 1px border, white text). Hover: semi-transparent white fill
- Both: uppercase, `letter-spacing: 0.15em`, `padding: 12px 32px`, `font-size: 14px`, `border-radius: 4px`

### 4.2 Services Section (`#thjonusta`)

Three service categories in a horizontal card layout.

**Section Layout:**
- Background: `var(--color-cream)` (`#FDF8F0`)
- Padding: 80px vertical
- Content: `max-width: 1200px`, centered
- No section heading — cards speak for themselves
- 3-column CSS Grid: `grid-template-columns: repeat(3, 1fr)`, gap `24–32px`
- Stacks to single column on mobile

**Service Card Component (×3):**

Each card structure from top to bottom:
1. Card container: White background, 1px gold/tan border (`var(--color-border-gold)`), no border-radius, no shadow
2. Heading: Uppercase text, Playfair Display, centered, bold, dark text, `letter-spacing: 0.1em`, positioned above the image
3. Image: Landscape aspect ratio (~4:3), `object-fit: cover`, full card width
4. Link: "Skoða nánar ›" — centered, gold text, Inter, underlined. Padding bottom: 16–20px

**Card Data:**

| Card | Heading | Image Description |
|---|---|---|
| 1 | BRÚÐKAUP | Smiling bride with elegant updo, warm lighting |
| 2 | VIÐBURÐIR | Group of women laughing, event-ready hair/makeup |
| 3 | KVIKMYNDIR & AUGLÝSINGAR | Stylist applying makeup in professional setting |

### 4.3 How We Work Section (`#svona-virkum-vid`)

A 3-step process section that builds trust and clarity.

**Section Layout:**
- Background: `#FFFFFF`
- Section heading: "PANNIG VIRKUM VIÐ" — centered, uppercase, Playfair Display, with gold decorative lines on each side (use `SectionHeading` component)
- 3-column horizontal layout

**Step Component (×3):**

Each step:
- Circled number: 48–56px circle with 1px gold border, number centered in Playfair Display 24px
- Description: Centered below circle, Inter 15–16px, regular weight, dark gray

| Step | Text (Icelandic) |
|---|---|
| 1 | Sendu okkur dagsetningu og fjölda |
| 2 | Við gerum tímaplan & tilboð |
| 3 | Við komum á staðinn & sjáum um rest |

### 4.4 Gallery Section (`#myndir`)

**Section Layout:**
- Background: `var(--color-cream-dark)` (`#F5EDE0`)
- Section heading: "MYNDIR AF VERKUM OKKAR" — with gold flanking lines

**Gallery Grid:**
- 4-column grid on desktop (`grid-template-columns: repeat(4, 1fr)`), 2-column tablet, 1-column mobile
- 4 images, same height, gap 8–12px
- Images: Various bridal/event hairstyles, `object-fit: cover`
- Hover: `transform: scale(1.05)` with `transition: transform 300ms ease`
- No lightbox for MVP

### 4.5 Testimonials & Contact Section (`#umsagnir`)

Combined section: testimonial left, inquiry form right.

**Section Layout:**
- Background: `var(--color-cream)` (`#FDF8F0`)
- Section heading: "VIÐSKIPTAVINIR SEGJA" — with gold flanking lines
- 2-column layout: Testimonial (~50%) | Form (~50%)
- On mobile: stacks vertically, testimonial first

**Testimonial Component (left):**
- Large decorative opening quote `"` in gold, 72–96px, Playfair Display
- Quote: „Þer voru algjörlega frábærar! Ég var í skýjunum með förðunina og harið og liðið við okkur var einstakt á brúðkaupsdaginn okkar." — Inter, 16px, italic, dark gray. Icelandic quotes: „ opening low, " closing high
- Attribution: "— Anna S." — Inter, 14px, bold

**Contact Form (right):**

| Field Label (IS) | Input Type | Placeholder | Validation |
|---|---|---|---|
| Nafn | text | Nafn | Required, min 2 chars |
| Netfang | email | Netfang | Required, valid email |
| Dagsetning | date / text | Dagsetning | Required |
| Staðsetning | text | Staðsetning | Required, min 2 chars |
| Fjöldi fólks | number / text | Fjöldi fólks | Required, numeric |
| Skilaboð | textarea | Skilaboð | Optional, max 500 chars |

**Form Styling:**
- All inputs: Full width, white bg, 1px border `var(--color-border-light)`, `padding: 12px 16px`, Inter 15px, `border-radius: 4px`
- Focus: Border changes to gold, subtle gold box-shadow
- Error: Red border (`#DC2626`), red error message 13px below
- Textarea: min 4 rows
- Submit: Full width, "SENDA FYRIRSPURN", gold bg, white uppercase text, `letter-spacing: 0.15em`, `padding: 14px`, `border-radius: 4px`. Hover: `#996F09`

**On Submit (MVP):** Show inline success message: "Takk fyrir! Við höfum móttekið fyrirspurn þína og munum hafa samband við þig fljótlega." with a green checkmark and a "Senda aðra fyrirspurn" reset link.

### 4.6 Footer (`#footer`)

- Background: `var(--color-cream-dark)` or white
- Top border: 1px gold line
- Content centered, single line on desktop:
  - `Netfang: info@harogfordun.is    Sími: 555-1234    Instagram: @harogfordun.is`
- Copyright: `© 2025 harogfordun.is – Öll réttindi áskilinn`
- Font: Inter, 13–14px, `var(--color-text-medium)`
- Padding: 32–40px vertical

---

## 5. Component Library

All components are React functional components with TypeScript interfaces. Each component has a co-located `.module.css` file.

| Component | File | CSS Module | Description |
|---|---|---|---|
| Navbar | `Navbar.tsx` | `Navbar.module.css` | Sticky nav, logo left, links + CTA right, mobile hamburger |
| HeroSection | `HeroSection.tsx` | `HeroSection.module.css` | Full-width bg image, overlay text + 2 CTAs |
| SectionHeading | `SectionHeading.tsx` | `SectionHeading.module.css` | `title` prop. Uppercase heading with gold `::before`/`::after` lines |
| ServiceCard | `ServiceCard.tsx` | `ServiceCard.module.css` | `title`, `imageSrc`, `imageAlt`, `href` props |
| ServicesSection | `ServicesSection.tsx` | `ServicesSection.module.css` | 3-column grid of ServiceCard |
| ProcessStep | `ProcessStep.tsx` | `ProcessStep.module.css` | `number`, `text` props. Circled number + desc |
| HowWeWorkSection | `HowWeWorkSection.tsx` | `HowWeWorkSection.module.css` | Section with 3 ProcessSteps |
| GallerySection | `GallerySection.tsx` | `GallerySection.module.css` | 4-column image grid with hover zoom |
| TestimonialCard | `TestimonialCard.tsx` | `TestimonialCard.module.css` | `quote`, `author` props. Decorative quote + attribution |
| ContactForm | `ContactForm.tsx` | `ContactForm.module.css` | React Hook Form, 6 fields, validation, success state |
| TestimonialsSection | `TestimonialsSection.tsx` | `TestimonialsSection.module.css` | 2-col: testimonial left, form right |
| Footer | `Footer.tsx` | `Footer.module.css` | Contact info + copyright |

---

## 6. Responsive Design Requirements

### 6.1 Breakpoints

Define in CSS Modules using standard media queries:

```css
/* Mobile first — default styles are mobile */
/* Tablet */
@media (min-width: 768px) { ... }
/* Desktop */
@media (min-width: 1024px) { ... }
/* Large Desktop */
@media (min-width: 1440px) { ... }
```

| Breakpoint | Range | Layout Changes |
|---|---|---|
| Mobile | < 768px | Single column, hamburger menu, 16px side padding |
| Tablet | 768–1023px | 2-column grids, condensed nav, 32px side padding |
| Desktop | 1024px+ | Full 3/4-column grids, horizontal nav, max-width 1200px centered |

### 6.2 Mobile Navigation

- Hamburger icon (3-line) replaces horizontal nav on `< 1024px`
- Opens full-screen overlay menu with links stacked vertically
- "FÁ TILBOÐ" button remains visible as prominent CTA
- Close: X icon or tap outside overlay
- Use `useState` for toggle, Framer Motion `AnimatePresence` for enter/exit

### 6.3 Section-Specific Mobile Adaptations

- **Hero:** Smaller fonts (36px title, 20px subtitle), stronger gradient overlay for readability
- **Services:** Cards stack single column, full width
- **How We Work:** Steps stack vertically
- **Gallery:** 2-column tablet, 1-column mobile
- **Testimonials + Form:** Stack vertically — testimonial first, then form, full width
- **Footer:** Contact info stacks vertically, centered

---

## 7. Content Specification (Icelandic)

All visible text is in Icelandic. Use these exact strings:

### Navigation
| Element | Text |
|---|---|
| Logo | harogfordun.is |
| Nav Link 1 | UM OKKUR |
| Nav Link 2 | ÞJÓNUSTA |
| Nav Link 3 | MYNDIR |
| Nav Link 4 | HAFÐU SAMBAND |
| CTA Button | FÁ TILBOÐ |

### Hero
| Element | Text |
|---|---|
| Title Line 1 | Hár & Förðun |
| Title Line 2 | FYRIR STÓRU STUNDIRNAR |
| Subtitle | Brúðkaup • Viðburðir • Kvikmyndir & Auglýsingar á Íslandi |
| Button 1 | FÁ TILBOÐ |
| Button 2 | SJÁ MYNDIR |

### Services
| Element | Text |
|---|---|
| Card 1 | BRÚÐKAUP |
| Card 2 | VIÐBURÐIR |
| Card 3 | KVIKMYNDIR & AUGLÝSINGAR |
| All Card Links | Skoða nánar › |

### How We Work
| Element | Text |
|---|---|
| Section Heading | PANNIG VIRKUM VIÐ |
| Step 1 | Sendu okkur dagsetningu og fjölda |
| Step 2 | Við gerum tímaplan & tilboð |
| Step 3 | Við komum á staðinn & sjáum um rest |

### Gallery
| Element | Text |
|---|---|
| Section Heading | MYNDIR AF VERKUM OKKAR |

### Testimonials & Contact
| Element | Text |
|---|---|
| Section Heading | VIÐSKIPTAVINIR SEGJA |
| Quote | „Þer voru algjörlega frábærar! Ég var í skýjunum með förðunina og harið og liðið við okkur var einstakt á brúðkaupsdaginn okkar." |
| Author | — Anna S. |
| Submit Button | SENDA FYRIRSPURN |

### Form Fields
| Label | Placeholder |
|---|---|
| Nafn | Nafn |
| Netfang | Netfang |
| Dagsetning | Dagsetning |
| Staðsetning | Staðsetning |
| Fjöldi fólks | Fjöldi fólks |
| Skilaboð | Skilaboð |

### Form Validation Messages (Icelandic)
| Field | Error Message |
|---|---|
| Nafn | Vinsamlegast skráðu nafn |
| Netfang | Vinsamlegast skráðu gilt netfang |
| Dagsetning | Vinsamlegast veldu dagsetningu |
| Staðsetning | Vinsamlegast skráðu staðsetningu |
| Fjöldi fólks | Vinsamlegast skráðu fjölda |
| Skilaboð | Hámark 500 stafir |

### Footer
| Element | Text |
|---|---|
| Email | Netfang: info@harogfordun.is |
| Phone | Sími: 555-1234 |
| Instagram | Instagram: @harogfordun.is |
| Copyright | © 2025 harogfordun.is – Öll réttindi áskilinn |

### Form Success Message
"Takk fyrir! Við höfum móttekið fyrirspurn þína og munum hafa samband við þig fljótlega."

### Form Reset Link
"Senda aðra fyrirspurn"

---

## 8. Form & Interaction Design

### 8.1 Form Validation

Use React Hook Form. All validation triggers on submit and on blur after first submit attempt.

### 8.2 Scroll Animations

Use Framer Motion `useInView` hook. Keep animations minimal and elegant:

- **Service cards:** Fade in + slide up (`y: 20 → 0`), 0.4s duration, staggered 0.15s per card
- **Process steps:** Fade in sequentially, 0.3s stagger
- **Gallery images:** Fade in on scroll, no slide
- **Testimonial + Form:** Fade in from left (testimonial) and right (form)
- All: `once: true`, ease-out easing

---

## 9. Image & Asset Strategy

### 9.1 Directory Structure

```
public/
  images/
    hero/          → hero-main.webp (1920×1080)
    services/      → brudkaup.webp, vidburdir.webp, kvikmyndir.webp
    gallery/       → gallery-01.webp through gallery-04.webp
    og/            → og-image.jpg (1200×630)
```

### 9.2 Image Requirements

| Image | Dimensions | Format | Max Size |
|---|---|---|---|
| Hero background | 1920 × 1080px | WebP (JPG fallback) | 200KB |
| Service card images (×3) | 600 × 450px | WebP | 80KB each |
| Gallery images (×4) | 600 × 600px | WebP | 100KB each |
| OG Social image | 1200 × 630px | JPG | 150KB |

### 9.3 Placeholder Strategy

Use high-quality stock images from Unsplash/Pexels during development:
- Hero: Woman in bridal makeup being attended to by stylist, warm golden lighting
- Brúðkaup: Close-up of smiling bride with elegant updo
- Viðburðir: Group of happy women at a celebration, styled hair
- Kvikmyndir: Professional makeup artist working on set
- Gallery 1–4: Various bridal/event hairstyles — updos, half-up styles, professional looks

### 9.4 Favicon

- Favicon: Simple gold "H" letter, 32×32 and 16×16 `.ico`
- Apple touch icon: 180×180 PNG

---

## 10. SEO & Performance

### 10.1 Metadata

Set in `index.html` `<head>`:

```html
<html lang="is">
<title>Hár & Förðun | Fagleg hár- og förðunarþjónusta á Íslandi</title>
<meta name="description" content="Fagleg hár- og förðunarþjónusta fyrir brúðkaup, viðburði, kvikmyndir og auglýsingar. Við komum á staðinn hvar sem er á Íslandi." />
<meta name="keywords" content="hár, förðun, brúðkaup, viðburðir, Ísland, makeup, hárgreiðsla, bridal" />
<meta property="og:title" content="Hár & Förðun | Fagleg hár- og förðunarþjónusta á Íslandi" />
<meta property="og:description" content="Fagleg hár- og förðunarþjónusta fyrir brúðkaup, viðburði, kvikmyndir og auglýsingar." />
<meta property="og:image" content="/images/og/og-image.jpg" />
<meta property="og:url" content="https://harogfordun.is" />
<meta property="og:locale" content="is_IS" />
```

### 10.2 Semantic HTML

- Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` correctly
- Section headings use `<h2>`, sub-elements `<h3>`
- All images have descriptive `alt` text in Icelandic
- Form labels associated via `htmlFor`/`id`
- ARIA labels on nav, form, and interactive elements

### 10.3 Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Largest Contentful Paint | < 2.5s |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |
| Total Page Weight | < 1.5MB |

### 10.4 Structured Data

Add JSON-LD in `index.html`:

```json
{
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "name": "Hár & Förðun",
  "url": "https://harogfordun.is",
  "email": "info@harogfordun.is",
  "telephone": "555-1234",
  "areaServed": "Iceland",
  "description": "Fagleg hár- og förðunarþjónusta fyrir brúðkaup, viðburði, kvikmyndir og auglýsingar á Íslandi."
}
```

---

## 11. Technical Implementation

### 11.1 Project Setup

```bash
npm create vite@latest harogfordun -- --template react-ts
cd harogfordun
npm install react-hook-form framer-motion lucide-react
```

### 11.2 App Entry Point

```tsx
// src/App.tsx
import Navbar from './components/Navbar/Navbar'
import HeroSection from './components/HeroSection/HeroSection'
import ServicesSection from './components/ServicesSection/ServicesSection'
import HowWeWorkSection from './components/HowWeWorkSection/HowWeWorkSection'
import GallerySection from './components/GallerySection/GallerySection'
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowWeWorkSection />
        <GallerySection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}

export default App
```

### 11.3 CSS Module Pattern

Every component uses a co-located `.module.css` file:

```tsx
// Example: SectionHeading.tsx
import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  title: string
}

export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>{title}</h2>
    </div>
  )
}
```

```css
/* SectionHeading.module.css */
.wrapper {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: var(--max-width);
  margin: 0 auto 48px;
  padding: 0 16px;
}

.wrapper::before,
.wrapper::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--color-border-gold);
}

.heading {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-dark);
  white-space: nowrap;
}
```

### 11.4 Global Styles

```css
/* src/styles/global.css */
@import './variables.css';

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text-dark);
  background-color: var(--color-cream);
  -webkit-font-smoothing: antialiased;
}

img {
  max-width: 100%;
  display: block;
}

a {
  text-decoration: none;
  color: inherit;
}
```

### 11.5 Key Implementation Notes

- The `SectionHeading` gold flanking lines use `display: flex` with `::before`/`::after` pseudo-elements, each with `flex: 1` and a 1px gold `background-color`
- All images use explicit `width`/`height` attributes to prevent CLS, and `loading="lazy"` except the hero image which gets `loading="eager"`
- Navbar smooth scroll: `element.scrollIntoView({ behavior: 'smooth' })` — target sections have `scroll-margin-top: var(--navbar-height)` in CSS
- Mobile hamburger: `useState` for toggle, Framer Motion `AnimatePresence` for slide-in animation
- `ContactForm` is the only component with significant client-side logic (React Hook Form)

---

## 12. File & Folder Structure

```
harogfordun/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── public/
│   ├── favicon.ico
│   └── images/
│       ├── hero/
│       │   └── hero-main.webp
│       ├── services/
│       │   ├── brudkaup.webp
│       │   ├── vidburdir.webp
│       │   └── kvikmyndir.webp
│       ├── gallery/
│       │   ├── gallery-01.webp
│       │   ├── gallery-02.webp
│       │   ├── gallery-03.webp
│       │   └── gallery-04.webp
│       └── og/
│           └── og-image.jpg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── styles/
│   │   ├── variables.css
│   │   └── global.css
│   └── components/
│       ├── Navbar/
│       │   ├── Navbar.tsx
│       │   └── Navbar.module.css
│       ├── HeroSection/
│       │   ├── HeroSection.tsx
│       │   └── HeroSection.module.css
│       ├── SectionHeading/
│       │   ├── SectionHeading.tsx
│       │   └── SectionHeading.module.css
│       ├── ServiceCard/
│       │   ├── ServiceCard.tsx
│       │   └── ServiceCard.module.css
│       ├── ServicesSection/
│       │   ├── ServicesSection.tsx
│       │   └── ServicesSection.module.css
│       ├── ProcessStep/
│       │   ├── ProcessStep.tsx
│       │   └── ProcessStep.module.css
│       ├── HowWeWorkSection/
│       │   ├── HowWeWorkSection.tsx
│       │   └── HowWeWorkSection.module.css
│       ├── GallerySection/
│       │   ├── GallerySection.tsx
│       │   └── GallerySection.module.css
│       ├── TestimonialCard/
│       │   ├── TestimonialCard.tsx
│       │   └── TestimonialCard.module.css
│       ├── ContactForm/
│       │   ├── ContactForm.tsx
│       │   └── ContactForm.module.css
│       ├── TestimonialsSection/
│       │   ├── TestimonialsSection.tsx
│       │   └── TestimonialsSection.module.css
│       └── Footer/
│           ├── Footer.tsx
│           └── Footer.module.css
└── README.md
```

---

## 13. Deployment & Launch Checklist

Deploy on Vercel or Netlify. Connect the `harogfordun.is` domain.

| Category | Task | ✓ |
|---|---|---|
| Content | All Icelandic text proofread and finalized | ☐ |
| Content | All placeholder images replaced with real photos | ☐ |
| SEO | Meta title, description, OG tags set | ☐ |
| SEO | JSON-LD structured data added | ☐ |
| SEO | sitemap.xml and robots.txt configured | ☐ |
| Performance | Lighthouse ≥ 90 all metrics | ☐ |
| Performance | All images optimized WebP < target sizes | ☐ |
| Responsive | Tested: iPhone SE, iPhone 14, iPad, Desktop 1440px | ☐ |
| Responsive | Mobile hamburger menu working | ☐ |
| Forms | Validation working with Icelandic messages | ☐ |
| Forms | Success message displays correctly | ☐ |
| Accessibility | All images have alt text | ☐ |
| Accessibility | Form labels and ARIA correct | ☐ |
| Accessibility | Keyboard navigation for all interactive elements | ☐ |
| Domain | harogfordun.is DNS pointing to host | ☐ |
| Domain | SSL/HTTPS active, HTTP redirects | ☐ |
| Analytics | Google Analytics or Plausible installed | ☐ |

---

## 14. Acceptance Criteria

The MVP is complete when ALL criteria are met:

### Visual Fidelity
1. Deployed site visually matches the design mockup in layout, spacing, typography, and color on desktop (1440px)
2. All section headings feature gold decorative flanking lines
3. Service cards display correct structure: heading → image → link
4. Hero features correct text hierarchy with left-aligned content over full-width background

### Functionality
1. All nav links smooth-scroll to target sections with correct offset
2. Mobile hamburger menu opens/closes correctly
3. Contact form validates all required fields with Icelandic error messages
4. Form submission shows Icelandic success message
5. Gallery displays 4-column grid on desktop

### Responsive
1. Fully functional and correct on viewports 320px–2560px
2. Nav collapses to hamburger on < 1024px
3. All grids adapt: mobile (1-col), tablet (2-col), desktop (3/4-col)

### Performance & Quality
1. Lighthouse Performance ≥ 90
2. Lighthouse Accessibility ≥ 90
3. No console errors in production build
4. All text in Icelandic per Section 7
5. `<html lang="is">` set

---

*— End of Document —*
