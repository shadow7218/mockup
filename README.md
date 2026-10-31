# StudioMock — 3D iPhone & iPad Mockup Customizer

A lightweight, zero-dependency 3D device showcase and iOS/iPadOS lock screen customizer built with pure HTML, CSS 3D Transforms, and Vanilla JavaScript. Designed to be edited and deployed directly from a mobile phone or browser via GitHub Pages.

## Features

- **Split Dual 3D Stage**: Real-time CSS 3D iPhone Pro and iPad Pro frames with side hardware buttons, Dynamic Island, and screen glare.
- **Live iOS/iPadOS Lock Screen**: Live ticking clock, customizable date, notification banner, and authentic bottom-corner Flashlight & Camera buttons.
- **Custom Image Uploads**: Upload custom lock screen wallpapers or replace the entire display with your own app screenshot (`FileReader` API).
- **Interactive 3D Controls**: Adjust horizontal/vertical 3D rotation angles, toggle floating animations, swap sides, or isolate a single device.
- **Hardware Finishes**: Switch between Space Black, Starlight Silver, and Desert Gold frames.
- **One-Click PNG Export**: Uses `html2canvas` (via CDN) to save high-resolution snapshots.

---

## Deploying on GitHub Pages (Step-by-Step from Your Phone)

1. **Create a New Repository**
   - Sign in to [GitHub](https://github.com) on your phone browser.
   - Tap the **+** icon in the top-right corner and select **New repository**.
   - Name your repository (e.g., `studiomock`), set it to **Public**, and tap **Create repository**.

2. **Add the Project Files**
   - Tap **creating a new file** on the repository setup screen.
   - Name the first file `index.html`, paste the `index.html` code block, and tap **Commit changes...**
   - Repeat this process to create `style.css`, `script.js`, and `README.md` in the root of your repository.

3. **Enable GitHub Pages**
   - Inside your repository, tap **Settings** (gear icon at the top).
   - Scroll down and tap **Pages** in the navigation menu.
   - Under **Build and deployment** → **Branch**, select `main` (or `master`) and `/ (root)`, then tap **Save**.

4. **Launch Your Site**
   - Wait 60 seconds and refresh the **Pages** settings screen.
   - Your live URL will appear at the top: `https://<your-username>.github.io/studiomock/`
