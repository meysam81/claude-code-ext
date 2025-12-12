# Claude Code Utilities

A lightweight Chrome extension that enhances the Claude Code web UI with additional utilities for power users.

## Features

- **Quick Session Search** (`Cmd/Ctrl + K`): Search through all your Claude Code sessions by title or repository name
- **Keyboard Navigation**: Full keyboard support - arrow keys to navigate, Enter to open, Escape to close
- **Dark Mode**: Automatically syncs with Claude's theme
- **Fast & Lightweight**: Built with Vue 3, Vite, and zero runtime dependencies

## Installation

### From Source (Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/anthropics/claude-code-ext.git
   cd claude-code-ext
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Build the extension:
   ```bash
   bun run build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder

### Optional: Generate Icons

If you want custom icons, run:
```bash
chmod +x scripts/generate-icons.sh
./scripts/generate-icons.sh
```

Requires ImageMagick or Inkscape.

## Usage

1. Navigate to [claude.ai](https://claude.ai)
2. Press `Cmd + K` (Mac) or `Ctrl + K` (Windows/Linux)
3. Start typing to search your sessions
4. Use arrow keys to navigate, Enter to open

## Development

```bash
# Install dependencies
bun install

# Build with watch mode
bun run dev

# Production build
bun run build

# Run linter
bun run lint

# Type check
bun run typecheck

# Create zip for distribution
bun run zip
```

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Build**: Vite 7
- **Styling**: UnoCSS (atomic CSS)
- **Language**: TypeScript
- **Package Manager**: Bun
- **Linting**: oxlint

## Project Structure

```
claude-code-ext/
├── public/
│   ├── manifest.json      # Chrome extension manifest (MV3)
│   └── icons/             # Extension icons
├── src/
│   ├── background/        # Service worker
│   ├── content/           # Content script entry
│   ├── components/        # Vue components
│   ├── composables/       # Vue composables
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── App.vue            # Root component
├── scripts/               # Build scripts
├── ROADMAP.md            # Feature roadmap
└── package.json
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features including:
- Session bookmarks/favorites
- Custom tags and labels
- Session export
- Recent sessions list
- And more...

## Contributing

Contributions are welcome! Please read the roadmap and open an issue before starting work on a new feature.

## License

MIT License - see [LICENSE](./LICENSE) for details.
