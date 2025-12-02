## This is a Chrome extension to construct URLs for time series queries from a web app

The URL Builder extension mockup has been created with a "Technical Dashboard" aesthetic, optimized for high-density data entry.

Features Implemented:

- Base Configuration: Dropdown with 5 configurable base URLs.
- Time Controls:
Start/End inputs supporting the specific yy.DDD.HH.mm.ss.SSS format.
Quick-set buttons for relative ranges (-15m, -1h, -1d, etc.).
- Facilities:
Predefined dropdown list.
- Custom free-text entry (press Enter or + to add).
Multi-select support with tag-based removal.
- Filters:
Severity checkboxes (INFO, Warning, Error) with color coding.
Message filter with optional Regex mode (toggles ~ prefix).
- Static Parameters: 3 customizable fields that can be toggled on/off.
### Output:
- Real-time URL preview.
- "Launch Query" button to open in new tab.
- Copy to clipboard functionality.

**Design Notes:**

Theme: Dark mode "DevTool" style (Slate/Zinc palette) using JetBrains Mono for technical data.
UX: Sticky footer for the action buttons ensures they are always accessible.


To turn this project into a usable Chrome Extension, I've performed the necessary setup.

I have:

- Created a manifest.json in client/public/. 
This is the configuration file Chrome needs to understand your extension.
- Generated an App Icon and placed it in client/public/icons/ so your extension looks professional in the toolbar.
- Created a Guide (CHROME_EXTENSION_GUIDE.md) in the root directory with step-by-step instructions.
### Quick Instructions:
- Build the Project: 
Run npm run build in the shell. This creates a dist folder.
- Load in Chrome:
Go to chrome://extensions/
Enable Developer Mode (top right).
Click Load Unpacked.
Select the dist/public folder.

You can now use the Query Builder directly from your browser toolbar
