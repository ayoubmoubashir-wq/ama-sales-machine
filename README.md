# AMA Automations

A premium, cinematic landing page for an AI & workflow automation studio.
Built with plain HTML5, CSS3 and vanilla JavaScript — no build step, no
framework, fully compatible with GitHub Pages.

## Folder structure

```
AMA-Automations/
│
├── index.html
├── style.css
├── script.js
├── config.js
│
├── assets/
│   ├── logo.svg
│   ├── favicon.svg
│   ├── icons/
│   │   ├── icon-ai.svg
│   │   ├── icon-workflow.svg
│   │   ├── icon-api.svg
│   │   └── icon-telegram.svg
│   └── images/
│
└── README.md
```

## Features

- Animated loading screen
- Aurora animated background + ambient mouse-reactive particle network
- Glassmorphism navigation and cards
- Scroll-triggered fade/rise reveals
- Animated statistic counters
- Ripple micro-interaction on buttons
- Full-screen guided consultation flow (8 questions, no AI — a scripted
  chat with a typing animation, progress bar and a review step before
  sending)
- Fully responsive: desktop, tablet, mobile
- Respects `prefers-reduced-motion`
- Visible keyboard focus states throughout

## Connecting the consultation to n8n

The consultation form never talks to Telegram directly, and no bot
token is ever exposed in the browser. Instead, answers are POSTed as
JSON to an **n8n webhook**, and your n8n workflow is responsible for
forwarding that data wherever you like (Telegram, email, a CRM, etc.).

1. In n8n, create a workflow that starts with a **Webhook** node
   (POST method).
2. Copy the webhook's production URL.
3. Open `config.js` and set:

   ```js
   const WEBHOOK_URL = "https://your-n8n-instance.com/webhook/your-id";
   ```

4. That's it — the "Submit consultation" button will POST a JSON object
   shaped like:

   ```json
   {
     "Name": "...",
     "Country": "...",
     "Business Type": "...",
     "Automation Needed": "...",
     "Current Tools": "...",
     "Monthly Leads": "...",
     "Budget": "...",
     "Preferred Contact": "..."
   }
   ```

If `WEBHOOK_URL` is left as the placeholder, or the request fails, the
site shows a friendly "demo mode" message instead of a hard error.

## Running locally

No build step is required. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with any static server, e.g.:

  ```bash
  python3 -m http.server 8000
  ```

  then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set the source to the branch
   containing these files (e.g. `main`) and the root folder (`/`).
4. Save — GitHub will publish the site at
   `https://<username>.github.io/<repository>/`.

## Customizing

- **Colors & fonts** — all defined as CSS custom properties at the top
  of `style.css` (`:root`), so the whole palette can be restyled from
  one place.
- **Questions** — edit the `questions` array near the top of the
  consultation section in `script.js`.
- **Copy** — headline, subheading and section text live directly in
  `index.html`.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses
`backdrop-filter`, CSS custom properties and `IntersectionObserver`,
all widely supported since 2021.
