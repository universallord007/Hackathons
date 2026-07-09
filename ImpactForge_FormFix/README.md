# FormFix

**Turn a photo of a confusing government, scholarship, or college form into plain, grade-8-level language — with a mandatory/optional field breakdown, a document checklist, and translation into 20 languages.**

Built for **ImpactForge**.

---

## The problem

Government notices, scholarship applications, and college paperwork are written for administrators, not for the people filling them out. First-generation students and families without someone to "translate" bureaucracy for them routinely miss deadlines, submit incomplete documents, or give up entirely — not because the task is hard, but because the *language* is hostile.

FormFix removes that barrier: photograph the form, and get back exactly what it's asking for, in words an 8th grader can act on, in the language you're most comfortable reading.

---

## What it does

1. **Upload** a photo of any form or notice (JPG, PNG, HEIC).
2. **OCR** extracts the raw text from the image and flags blurry/unreadable scans before they waste your time.
3. **An AI agent reads and rewrites it** — producing a plain-language summary, a list of mandatory fields, a list of optional fields, a document checklist, and any deadlines/traps worth flagging.
4. **Optional translation** — flip the entire result (summary, fields, checklist, warnings) into Hindi, Bengali, Tamil, Spanish, Italian, Japanese, and 14 other languages, with one tap.
5. **Results render live** in a card-based UI: confidence score, collapsible raw OCR text, mandatory (red) vs. optional (teal) field tags, a checklist, and a warnings panel.

Nothing is stored server-side. Each session is stateless — the image and text exist only for the duration of the request.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | API routes + frontend in one deployable unit, ideal for building |
| UI | **React 18 + Tailwind CSS 3** | Fast iteration, utility-first styling |
| Animation | **Framer Motion** | Page transitions, staggered reveals, the scan-line hero animation |
| Icons | **lucide-react** | Consistent, tree-shakeable icon set |
| OCR | **Tesseract.js** | Free, runs server-side in the API route, no external OCR API/cost |
| Simplification | **Groq API — Llama 3.3 70B Versatile** | Free-tier friendly, very low latency, structured JSON output mode |
| Translation | **Groq API — Llama 3.3 70B Versatile** | Reused the same model instead of adding a second dependency (LibreTranslate) — one less moving part, same quality, keeps the AI agent's plain-language tone consistent across languages |
| Deployment | **Vercel** | Zero-config Next.js hosting |

> **Note on translation:** the original plan was Tesseract.js (OCR) + Groq (simplify) + LibreTranslate (translate). LibreTranslate was dropped in favor of routing translation through Groq as well — fewer external dependencies, no separate API to keep alive during the demo, and better handling of plain-language tone across languages than a generic MT service.

---

## Architecture

```
   ┌─────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
   │   Upload    │ ───▶ │  /api/ocr    │ ───▶ │ /api/simplify   │ ───▶ │ /api/translate│
   │ (image file)│      │ Tesseract.js │      │ Groq · Llama 3.3│      │  (optional)   │
   └─────────────┘      └──────────────┘      └─────────────────┘      └──────────────┘
                          raw text +             structured JSON:         same JSON shape,
                          confidence score        summary, fields,        every field
                                                   checklist, warnings    translated
```

**Why two separate Groq calls (simplify + translate) instead of one:** translation is optional and happens *after* the user has already seen the English result — bundling it into the first call would mean paying LLM latency for a feature most demo views won't even touch. Splitting them keeps the initial "wow, it's already done" response as fast as possible.

**Key-pooling:** the app uses 4 Groq API keys, split into two pools of 2 (`lib/groq-pool.js`):
- Keys 1–2 → translation calls (many small parallel requests per document — one per field)
- Keys 3–4 → the OCR-simplification agent call

Each pool round-robins across its keys and, if a call comes back rate-limited (HTTP 429), automatically retries on the next key in the pool before giving up. Any *other* kind of error (bad prompt, invalid key, model error) fails immediately instead of silently burning through all 4 keys — so real bugs surface fast instead of hiding behind retries.

---

## Project structure

```
formfix/
├── app/
│   ├── page.js                     # main page: hero, how-it-works, features, the working app
│   ├── layout.js                   # fonts (Space Grotesk / Inter / IBM Plex Mono), metadata
│   ├── globals.css                 # design tokens, glassmorphism + glow utilities
│   ├── components/
│   │   ├── AmbientBackground.jsx   # animated glow-orb background
│   │   ├── ScanIllustration.jsx    # hero's signature scanning-paper animation
│   │   ├── UploadBox.jsx           # drag/drop + file picker + preview
│   │   ├── LoadingState.jsx        # multi-step pipeline progress indicator
│   │   ├── ResultCard.jsx          # summary, confidence, raw-text toggle, language switch
│   │   ├── ChecklistPanel.jsx      # mandatory/optional tags, checklist, warnings
│   │   └── LanguageSelector.jsx    # 20-language dropdown (Indian + Global groups)
│   ├── lib/
│   │   ├── ocr.js                  # Tesseract.js wrapper, confidence/blur detection
│   │   ├── groq.js                 # OCR-text → structured JSON simplification
│   │   ├── translate.js            # structured-result translation (20 languages)
│   │   └── groq-pool.js            # 4-key round-robin pool with 429 auto-retry
│   └── api/
│       ├── ocr/route.js
│       ├── simplify/route.js
│       └── translate/route.js
├── tailwind.config.js
├── postcss.config.js
├── .env.local.example
└── package.json
```

---

## Getting started

**1. Install dependencies**
```bash
npm install
```

**2. Get Groq API keys**

Create 4 free keys at [console.groq.com/keys](https://console.groq.com/keys) — ideally from separate accounts, so each has its own free-tier rate limit.

**3. Set up environment variables**

Copy `.env.local.example` to `.env.local` and fill in your keys:
```bash
GROQ_API_KEY1=your_first_groq_key_here   # translation pool
GROQ_API_KEY2=your_second_groq_key_here  # translation pool
GROQ_API_KEY3=your_third_groq_key_here   # simplify/agent pool
GROQ_API_KEY4=your_fourth_groq_key_here  # simplify/agent pool
```

**4. Run it**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

**5. Deploy**

Push to Vercel and add the same 4 environment variables in the project's dashboard under Settings → Environment Variables.

---

## API reference

### `POST /api/ocr`
`multipart/form-data` — fields: `image` (file, required), `lang` (string, optional, default `"eng"`)

```json
// 200
{
  "text": "extracted raw text...",
  "confidence": 87.4,
  "isLowConfidence": false,
  "warning": null
}
```
```json
// 400 / 422 / 500
{ "error": "OCR_NO_TEXT_FOUND", "message": "We couldn't read any text from this image..." }
```

### `POST /api/simplify`
`application/json` — `{ "text": "raw OCR text" }`

```json
// 200
{
  "summary": "This is a scholarship renewal form...",
  "mandatoryFields": ["Full legal name", "Student ID number", "..."],
  "optionalFields": ["Alternate contact phone", "..."],
  "documentChecklist": ["Income certificate", "Aadhaar card copy", "..."],
  "warnings": ["Must be submitted within 10 days of the notice date", "..."]
}
```

### `POST /api/translate`
`application/json` — `{ "result": {...simplify response}, "targetLang": "hi" }`

Returns the same shape as `/api/simplify`, with every string field translated. Falls back to the original English text per-field on any failure — translation never breaks the core result.

**Supported language codes:** `hi bn ta te mr gu kn ml pa ur` (Indian) · `es fr it de pt ar zh ja ko ru` (Global)

---

## Edge cases handled

- **Blurry/low-quality photos** — OCR confidence is scored; below 60% triggers a visible warning banner instead of silently returning garbage text.
- **Empty/unreadable scans** — rejected with a clear message before ever reaching the LLM.
- **Too-short extracted text** — rejected before the simplify call, since there's nothing meaningful to summarize.
- **Malformed LLM output** — `groq.js` validates the shape of every field and substitutes safe defaults (empty arrays, a fallback message) rather than crashing the UI.
- **Rate limiting** — automatic key rotation across the 4-key pool absorbs Groq free-tier limits during a live demo.
- **Translation failure** — falls back to English per field rather than showing an error for the whole result.

---

## Design

Dark theme, "official form" identity: paper/highlighter/stamp color language (a highlighter-yellow accent for mandatory/primary actions, a stamp-red for warnings, muted teal for optional/secondary). The hero's signature animation is a highlighter bar scanning down a mock form, revealing plain-language text where dense jargon was a moment ago — literally showing what the product does. Glassmorphic cards float over three slow-drifting ambient glows instead of a flat background.

---

## Credits

Built by **Dipankar** — [dipcodesdev.vercel.app](https://dipcodesdev.vercel.app/)