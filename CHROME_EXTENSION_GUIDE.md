# How to Run as a Chrome Extension

You can load this project directly into Google Chrome as a developer extension.

## 1. Build the Project
First, you need to generate the static files. In the Replit shell, run:

```bash
npm run build
```

This will create a `dist` folder containing the compiled application.

## 2. Load into Chrome
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click the **Load unpacked** button (top-left).
4. Select the `dist/public` folder from this project.

## 3. Usage
- Click the extension icon in your browser toolbar.
- The Query Builder interface will open in a popup.
- You can build URLs and launch them directly.

## Note on Navigation
Since this is running as an extension popup, standard browser navigation (back/forward) works differently. The app is designed as a single-view tool for this reason.
