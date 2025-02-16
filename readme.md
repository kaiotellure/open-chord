
![banner](./.github/presentation-banner.png)

##### Install the Youtube Chords extension

[![Google Chrome](https://img.shields.io/badge/For%20Chromium%20Browsers-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)](https://chromewebstore.google.com/)
[![Firefox](https://img.shields.io/badge/For%20Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/)

##### Features
- **Straightforward**: This extension will show chords under the Youtube player, and that's it, no bloatware.
- **Open**: Anyone can see, add or edit transcriptions freely.

##### Technical Summary

- **Extension**: The extension's content injected UI interface uses Preact for a lightweight reactive design, styling is made with TailwindCSS, all being bundled using Vite to an IIFE `content.js` file.
- **Storage**: Initially transcriptions files are being stored using Github's Pages serving pre-generated JSON files. As it grows and starts requiring a more robust infrastructure we do plan to add a CDN strategy or a database solution.

##### Nuances About Youtube
- **Styles not applying**: When using the following CSS properties: Background Colors, Padding, Margin and Border, make sure to make them `!important`, as Youtube has pre-flight styles that overwrites these Tailwind classes.