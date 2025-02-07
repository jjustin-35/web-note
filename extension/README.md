# Web Note Papers Chrome Extension

A Chrome extension that allows you to add draggable sticky notes to any web page.

## Features

- Add notes to any web page
- Drag and drop notes anywhere
- Three color options (yellow, pink, blue)
- Notes persist across page visits
- Sidebar to view all notes
- First line becomes note title
- Keyboard shortcut (Ctrl/Cmd + Shift + N) to add notes

## Development

This extension is built with TypeScript for better type safety and maintainability.

### Prerequisites

- Node.js and npm
- Chrome browser

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. For development with watch mode:
```bash
npm run watch
```

### Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` directory

### Project Structure

```
extension/
├── src/
│   ├── content.ts      # Main extension logic
│   ├── types.ts        # TypeScript type definitions
│   └── styles/
│       └── content.css # Styles for notes and sidebar
├── manifest.json       # Extension manifest
├── sidebar.html       # Sidebar template
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies and scripts
```

## Building for Production

1. Run the build command:
```bash
npm run build
```

2. The built extension will be in the `dist` directory
3. You can then zip the `dist` directory for distribution

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
