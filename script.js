/* =========================================================
   Taste of Africa - script.js (linked on every page)
   1 Recipe data  2 Dark/light theme  3 Recipe filter
   4 Favorites (localStorage)  5 Favorites page
   6 Ingredient scaler  7 Contact form validation
   8 Newsletter form  9 Scroll-in animation
   Each feature checks that its elements exist first, because
   not every page has every feature.
   ========================================================= */

/* ---------- 1. Recipe data (used to build the Favorites page) ---------- */
const RECIPES = {
  'jollof-rice': {
    name: 'Jollof Rice',
    region: 'West Africa',
    url: 'jollof-rice.html',
    image: 'images/jollof-rice.jpg',
    alt: 'A plate of red jollof rice served with fried plantain',
    blurb: 'One-pot rice cooked in a smoky tomato and pepper sauce.'
  },
  'injera': {
    name: 'Injera',
    region: 'East Africa',
    url: 'injera.html',
    image: 'images/injera.jpg',
    alt: 'Round injera flatbread topped with colourful Ethiopian stews',
    blurb: 'Spongy, tangy flatbread made from fermented teff flour.'
  },
  'tagine': {
    name: 'Chicken Tagine',
    region: 'North Africa',
    url: 'tagine.html',
    image: 'images/tagine.jpg',
    alt: 'Clay tagine pots with cone-shaped lids cooking over hot coals',
    blurb: 'Chicken slow-cooked with saffron, preserved lemon and olives.'
  },
  'isombe': {
    name: 'Isombe',
    region: 'East Africa',
    url: 'isombe.html',
    image: 'images/isombe.jpg',
    alt: 'A mound of green isombe served over white rice on a wooden plate',
    blurb: 'Rwandan cassava leaves simmered with peanut and palm oil.'
  }
};

const FAVORITES_KEY = 'toa-favorites';
const THEME_KEY = 'toa-theme';
const NEWSLETTER_KEY = 'toa-newsletter';

/* Small helpers so localStorage errors (e.g. private mode) don't break the page */
function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    /* Storage is unavailable: the feature still works until the page reloads */
  }
}

/* ---------- 2. Dark / light theme toggle ---------- */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = readStorage(THEME_KEY, prefersDark ? 'dark' : 'light');

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggle) {
      // The button shows an icon only, so the label tells screen readers what it does
      const next = theme === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      toggle.title = 'Switch to ' + next + ' mode';
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  applyTheme();

  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      writeStorage(THEME_KEY, theme);
      applyTheme();
    });
  }
}

/* ---------- 3. Recipe filter (Recipes page) ---------- */
function initRecipeFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.recipe-card');
  const count = document.getElementById('resultsCount');
  if (buttons.length === 0 || cards.length === 0) return;

  function filterRecipes(region) {
    let shown = 0;

    // Loop over every card and hide the ones from other regions
    cards.forEach(function (card) {
      const matches = region === 'all' || card.dataset.region === region;
      card.classList.toggle('hidden', !matches);
      if (matches) shown++;
    });

    // Mark the clicked button as the active one
    buttons.forEach(function (button) {
      const isActive = button.dataset.filter === region;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (count) {
      count.textContent = 'Showing ' + shown + ' of ' + cards.length + ' recipes';
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterRecipes(button.dataset.filter);
    });
  });

  filterRecipes('all');
}

/* ---------- 4. Add to Favorites (saved in localStorage) ---------- */
function getFavorites() {
  return readStorage(FAVORITES_KEY, []);
}

function updateFavoriteButtons() {
  const favorites = getFavorites();

  document.querySelectorAll('.fav-btn').forEach(function (button) {
    const isFavorite = favorites.includes(button.dataset.recipeId);
    const label = button.querySelector('.fav-label');
    button.classList.toggle('is-favorite', isFavorite);
    button.setAttribute('aria-pressed', String(isFavorite));
    if (label) label.textContent = isFavorite ? 'Saved' : 'Favorite';
  });
}

function toggleFavorite(recipeId) {
  let favorites = getFavorites();

  if (favorites.includes(recipeId)) {
    favorites = favorites.filter(function (id) { return id !== recipeId; });
  } else {
    favorites.push(recipeId);
  }

  writeStorage(FAVORITES_KEY, favorites);
  updateFavoriteButtons();
  renderFavoritesPage();
}

function initFavorites() {
  // One listener on the document also covers buttons created later (Favorites page)
  document.addEventListener('click', function (event) {
    const button = event.target.closest('.fav-btn');
    if (button) toggleFavorite(button.dataset.recipeId);
  });

  // Restore saved favorites when the page loads
  updateFavoriteButtons();
}

/* ---------- 5. Favorites page: build a card for each saved recipe ---------- */
function renderFavoritesPage() {
  const list = document.getElementById('favoritesList');
  const empty = document.getElementById('favoritesEmpty');
  if (!list) return;

  const favorites = getFavorites().filter(function (id) { return RECIPES[id]; });
  list.innerHTML = '';
  if (empty) empty.hidden = favorites.length > 0;

  favorites.forEach(function (id) {
    const recipe = RECIPES[id];
    const card = document.createElement('article');
    card.className = 'card';

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = recipe.alt;
    const caption = document.createElement('figcaption');
    caption.textContent = recipe.name + ', ' + recipe.region;
    figure.append(img, caption);

    const body = document.createElement('div');
    body.className = 'card-body';
    const title = document.createElement('h2');
    title.textContent = recipe.name;
    title.style.fontSize = '1.4rem';
    const text = document.createElement('p');
    text.textContent = recipe.blurb;

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const link = document.createElement('a');
    link.className = 'btn';
    link.href = recipe.url;
    link.textContent = 'View recipe';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'fav-btn is-favorite';
    remove.dataset.recipeId = id;
    remove.setAttribute('aria-pressed', 'true');
    remove.innerHTML = '<span class="heart" aria-hidden="true">&hearts;</span> <span class="fav-label">Saved</span>';
    actions.append(link, remove);

    body.append(title, text, actions);
    card.append(figure, body);
    list.append(card);
  });
}

/* ---------- 6. Ingredient scaler (recipe pages) ---------- */
// Turns 0.5 into "1/2", 1.25 into "1 1/4", 2.4 into "2.4" and 1500 into "1500"
function formatQuantity(value) {
  if (value >= 10) return String(Math.round(value));

  const fractions = [[0.25, '1/4'], [0.333, '1/3'], [0.5, '1/2'], [0.667, '2/3'], [0.75, '3/4']];
  const whole = Math.floor(value);
  const rest = value - whole;

  if (rest < 0.04) return String(whole);
  if (rest > 0.96) return String(whole + 1);

  for (const [amount, label] of fractions) {
    if (Math.abs(rest - amount) < 0.04) {
      return whole > 0 ? whole + ' ' + label : label;
    }
  }
  return String(Math.round(value * 10) / 10);
}

function initIngredientScaler() {
  const scaler = document.querySelector('.servings');
  if (!scaler) return;

  const baseServings = Number(scaler.dataset.baseServings);
  const display = document.getElementById('servingCount');
  const quantities = document.querySelectorAll('.ingredients .qty');
  let servings = baseServings;

  function updateQuantities() {
    display.textContent = servings;
    quantities.forEach(function (qty) {
      const scaled = Number(qty.dataset.qty) * servings / baseServings;
      qty.textContent = formatQuantity(scaled);
    });
  }

  scaler.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('click', function () {
      const change = Number(button.dataset.change);
      servings = Math.min(12, Math.max(1, servings + change));
      updateQuantities();
    });
  });

  updateQuantities();
}

/* ---------- 7. Contact form validation and feedback ---------- */
function showFieldError(field, message) {
  const error = document.getElementById(field.id + 'Error');
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const countrySelect = document.getElementById('country');
  const messageInput = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  const confirmation = document.getElementById('confirmation');
  const MIN_MESSAGE = 20;

  // Live character counter under the message box
  messageInput.addEventListener('input', function () {
    const length = messageInput.value.trim().length;
    charCount.textContent = length + ' characters' +
      (length > MIN_MESSAGE ? ' - looks good!' : ' (more than ' + MIN_MESSAGE + ' needed)');
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();   // stop the browser from sending the form
    let isValid = true;

    const name = nameInput.value.trim();
    if (name.length < 2) {
      showFieldError(nameInput, 'Please enter your name.');
      isValid = false;
    } else {
      showFieldError(nameInput, '');
    }

    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      showFieldError(emailInput, 'Please enter a valid email, like you@example.com.');
      isValid = false;
    } else {
      showFieldError(emailInput, '');
    }

    if (!countrySelect.value) {
      showFieldError(countrySelect, 'Please choose your country.');
      isValid = false;
    } else {
      showFieldError(countrySelect, '');
    }

    if (messageInput.value.trim().length <= MIN_MESSAGE) {
      showFieldError(messageInput, 'Your message must be more than ' + MIN_MESSAGE + ' characters.');
      isValid = false;
    } else {
      showFieldError(messageInput, '');
    }

    if (!isValid) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    // Success: hide the form and thank the user by name
    form.hidden = true;
    confirmation.textContent = 'Thank you, ' + name + "! We've received your message.";
    confirmation.hidden = false;
    confirmation.focus();
  });
}

/* ---------- 8. Newsletter signup (footer on every page) ---------- */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  const input = document.getElementById('newsletterEmail');
  const message = document.getElementById('newsletterMessage');
  const saved = readStorage(NEWSLETTER_KEY, null);

  if (saved) message.textContent = 'You are subscribed as ' + saved + '.';

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = input.value.trim();

    if (!email || !input.checkValidity()) {
      message.textContent = 'Please enter a valid email address.';
      input.focus();
      return;
    }

    writeStorage(NEWSLETTER_KEY, email);
    message.textContent = 'Thanks for signing up! A new recipe will reach ' + email + ' each week.';
    form.reset();
  });
}

/* ---------- 9. Scroll-in animation for cards ---------- */
function initReveal() {
  const items = document.querySelectorAll('.card, .trend, .stat');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (item) {
    item.classList.add('reveal');
    observer.observe(item);
  });
}

/* ---------- Start everything once the HTML is ready ---------- */
document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initRecipeFilter();
  initFavorites();
  renderFavoritesPage();
  initIngredientScaler();
  initContactForm();
  initNewsletter();
  initReveal();
});
