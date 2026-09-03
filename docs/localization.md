# Kreu language system

Albanian (`sq`, regional formatting `sq-AL`) is the default. English remains available through the AL / EN controls in navigation, booking and footer. A same-site language-preference cookie preserves the choice. The server reads it so HTML language, metadata and initial copy agree without a language flash; the homepage is therefore rendered per request.

Use `useLanguage().t()` for user-facing copy and maintain the natural Albanian version in `lib/localization.ts`. English phrases are stable dictionary keys. Translate presentation only: never change customer input, booking enum values, project slugs, URLs or brand names. Calendar and confirmation dates use the selected locale and retain Europe/Tirane time.

The Albanian copy is written for business owners, with concise headlines rather than literal translations. Industry terms deliberately retained: website, Web Development, Software, Mobile, SEO, Marketing, online, email and Peeling. Brand names, Instagram, contact addresses and the IANA timezone name stay unchanged. No E-commerce or Google Meet labels are currently displayed; preserve these names if introduced.

The original Still product photograph has English interface text baked into the pixels. Its category, description and accessible image description are localized. A separately approved Albanian image is needed to localize the photographed interface without altering the project visual; the original asset has not been modified.

Cal.com manages its own invitation emails and conferencing interface. This localization covers the Kreu booking UI, not externally hosted Cal.com screens or email templates.

Verification: `node --test tests/*.test.mjs`, `npx tsc --noEmit`, `npm run build`. When adding copy, check both languages at 390, 430, 768, 1024 and 1440px, including long validation messages. Keep the current typography and animation logic.
