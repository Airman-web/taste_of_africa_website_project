# Taste of Africa

A multi-page website celebrating Africa's culinary traditions, built with semantic **HTML5**, **CSS3** and vanilla **JavaScript**. It showcases signature dishes, regional food cultures and step-by-step recipes, with interactive features like recipe filtering, saved favorites and form validation.

> Formative assignment: *Taste of Africa Website Project*

**Live site:** https://airman-web.github.io/taste_of_africa_website_project/

---

## Table of Contents

- [Features](#features)
- [Pages](#pages)
- [JavaScript Functionality](#javascript-functionality)
- [Styling](#styling)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [Accessibility](#accessibility)
- [Credits](#credits)
- [Author](#author)

---

## Features

- Hero section with a background image and an embedded YouTube introduction to African food culture
- Four full recipes, each with an ingredients list, an expandable method, a video tutorial, a nutrition table and a map of the country it comes from
- Three culinary region pages covering staples, spices, cooking techniques and example dishes
- Recipe filter by region, with no page reload
- **Favorites** saved in `localStorage`, which stay after a refresh
- Ingredient scaler that recalculates quantities for any number of servings
- Dark / light mode toggle that is remembered across pages
- Contact form validated with JavaScript, plus a newsletter signup in every footer
- Responsive layout for phones, tablets and desktops

## Pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Hero with video, featured dishes (`<figure>` + `<figcaption>`), explore by region, latest food trends (`<article>`) |
| Recipes | `recipes.html` | Filterable recipe cards with favorite buttons, plus a summary table |
| Jollof Rice | `jollof-rice.html` | West Africa · Senegal / Nigeria / Ghana |
| Injera | `injera.html` | East Africa · Ethiopia |
| Chicken Tagine | `tagine.html` | North Africa · Morocco |
| Isombe | `isombe.html` | East Africa · Rwanda |
| West Africa | `west-africa.html` | Food culture, staples, spices, techniques, dishes, video |
| East Africa | `east-africa.html` | Food culture, staples, spices, techniques, dishes, video |
| North Africa | `north-africa.html` | Food culture, staples, spices, techniques, dishes, video |
| Favorites | `favorites.html` | Recipes the user has saved, rendered from `localStorage` |
| About Us | `about.html` | Mission, history and global influence of African cuisine, a Google Map of Jemaa el-Fnaa (Marrakech), photo credits |
| Contact | `contact.html` | Contact form with name, email, country `<select>`, `<datalist>` suggestions and message |

Each recipe page includes:

- Dish name, photo and cultural background
- Ingredients list (`<ul>`) with a servings scaler
- Cooking steps in `<details>` / `<summary>`
- Embedded YouTube tutorial
- Nutrition facts table
- Embedded map (`<iframe>`) of the country of origin

## JavaScript Functionality

All behaviour lives in a single `script.js` file, linked on every page. Each feature first checks that its elements exist on the current page.

| Feature | How it works |
| --- | --- |
| **Recipe filter** | Filter buttons carry `data-filter` and recipe cards carry `data-region`. A click handler (`addEventListener`) loops over the cards and toggles a `.hidden` class. |
| **Add to Favorites** | The ♥ button turns red, and the recipe ID is stored in `localStorage`. Saved favorites are restored on page load and listed on the Favorites page. |
| **Ingredient scaler** | The + / − buttons rescale each quantity from its `data-qty` value and show results as friendly fractions (e.g. `2 1/2`). |
| **Theme toggle** | Sets `data-theme="dark"` on `<html>` and saves the choice in `localStorage`. |
| **Form validation** | Uses `event.preventDefault()` and checks every field. The message must be more than 20 characters. On success the form is hidden and a message is shown: *"Thank you, [Name]! We've received your message."* |
| **Newsletter** | Validates the email and confirms the signup in the footer. |
| **Scroll animation** | Cards fade in as they enter the viewport (`IntersectionObserver`). |

> **Note:** The contact and newsletter forms run entirely in the browser. They show their confirmation messages but do not send email, because a static site has no server.

## Styling

- **Palette** inspired by African spices and landscapes: paprika red, saffron yellow, cocoa and baobab browns, moss green
- **Google Fonts:** *Abril Fatface* for headings, *Nunito* for body text
- CSS custom properties (variables) for colours, so dark mode only swaps tokens
- Cards with shadows and rounded corners, custom `<mark>` highlighting, and styled tables, lists and `<details>`
- Form focus states with a glow, plus inline error messages
- Responsive layout using `rem`, `%`, `vw`, `clamp()`, CSS Grid and Flexbox, with breakpoints at 760px and 420px
- Respects `prefers-reduced-motion`

## Project Structure

```
taste_of_africa_website_project/
├── index.html
├── recipes.html
├── jollof-rice.html
├── injera.html
├── tagine.html
├── isombe.html
├── west-africa.html
├── east-africa.html
├── north-africa.html
├── favorites.html
├── about.html
├── contact.html
├── styles.css
├── script.js
├── images/
└── README.md
```

## Running Locally

No build step or dependencies are needed.

```bash
git clone https://github.com/Airman-web/taste_of_africa_website_project.git
cd taste_of_africa_website_project
```

Then open `index.html` in a browser. For the embedded videos and maps to load reliably, you can serve the folder instead:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Accessibility

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- A "Skip to main content" link and visible focus outlines
- Descriptive `alt` text on every image, and a `title` on every `<iframe>`
- Every form field has a `<label>`; errors are announced with `aria-live`
- `aria-pressed` on toggle buttons and `aria-current` on the active nav link

## Credits

- **Photos:** Wikimedia Commons, used under Creative Commons licences. Each photo is credited individually on the [About page](about.html#credits-title).
- **Videos:** Embedded from YouTube. Each video belongs to its creator.
- **Fonts:** [Google Fonts](https://fonts.google.com/).

## Author

**Atigbi Emmanuel Ayomiku**
