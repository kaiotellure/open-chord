
![yt-video-page](.github/presentation-banner.png)

###### Get Extension
> [!NOTE]
> Extensions are NOT published yet

[![Google Chrome](https://img.shields.io/badge/For%20Chromium%20Browsers-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)](https://chromewebstore.google.com/)
[![Firefox](https://img.shields.io/badge/For%20Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/)

# Features
- **Zero Overhead**: Install Extension &rarr; Get song's chord progression right at the music video page, no configuration required.
- **Made by you for you**: Easily add, edit or fix transcriptions.

###### Technical Summary

- **Extension**: The extension's content injected UI interface uses Preact for a lightweight reactive design, styling is done with TailwindCSS, all being bundled using Vite to an IIFE `content.js` file.
- **Storage**: Initially transcriptions files are being stored using Github's Pages serving pre-generated JSON files. As it's grows and start requiring more infrastructure we do plan to add a CDN strategy or a database solution.
