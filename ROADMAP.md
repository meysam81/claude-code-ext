# Claude Code Utilities - Roadmap

This document outlines the planned features and improvements for the Claude Code Utilities Chrome extension.

## Current Features (v1.0.0)

- **Session Search**: Quick search across all Claude Code sessions by title or repository name
- **Keyboard Navigation**: Full keyboard support with `Cmd/Ctrl + K` to open, arrow keys to navigate, Enter to select
- **Dark Mode**: Automatic theme detection synced with Claude's interface
- **Responsive UI**: Modern command palette design inspired by popular tools like VS Code, Linear, and Raycast

---

## Planned Features

### Phase 1: Enhanced Session Management

#### Session Bookmarks/Favorites

**Priority**: High
**Complexity**: Medium

Allow users to bookmark frequently accessed sessions for quick access.

**Implementation Details**:

- Add star/bookmark icon to search results
- Create a "Favorites" section at the top of results when query is empty
- Store favorites in `chrome.storage.sync` for cross-device sync
- Add keyboard shortcut (`Cmd/Ctrl + D`) to toggle bookmark on selected session

**Files to modify**:

- `src/types/api.ts` - Add `BookmarkedSession` type
- `src/services/storage.ts` - Create new storage service for bookmarks
- `src/composables/useBookmarks.ts` - New composable for bookmark management
- `src/components/SearchResult.vue` - Add bookmark toggle button
- `src/components/CommandPalette.vue` - Add favorites section

---

#### Session Tags/Labels

**Priority**: Medium
**Complexity**: High

Enable users to organize sessions with custom tags for better categorization.

**Implementation Details**:

- Create tag management UI (add/remove/edit tags)
- Support color-coded tags
- Filter sessions by tags in search
- Store tags in `chrome.storage.sync`
- Support tag autocomplete when filtering

**Files to modify**:

- `src/types/api.ts` - Add `Tag` and `SessionTag` types
- `src/services/storage.ts` - Add tag storage methods
- `src/composables/useTags.ts` - New composable for tag management
- `src/components/TagPicker.vue` - New component for tag selection
- `src/components/SearchResult.vue` - Display tags on results
- `src/components/CommandPalette.vue` - Add tag filter mode

---

#### Quick Session Deletion

**Priority**: Low
**Complexity**: Medium

Allow users to delete sessions directly from the command palette.

**Implementation Details**:

- Add delete action (with confirmation) to search results
- Implement Claude API call for session deletion
- Add keyboard shortcut (`Cmd/Ctrl + Backspace`) for delete action
- Show success/error toast notification

**Files to modify**:

- `src/services/claude-api.ts` - Add `deleteSession` method
- `src/components/SearchResult.vue` - Add delete button
- `src/components/ConfirmDialog.vue` - New confirmation dialog component
- `src/components/Toast.vue` - New toast notification component

---

### Phase 2: Data Export & Import

#### Session Export

**Priority**: Medium
**Complexity**: High

Export session data for backup or analysis purposes.

**Implementation Details**:

- Export formats: JSON, Markdown, CSV
- Export options: single session, filtered results, all sessions
- Include session metadata (title, repo, dates, conversation history)
- Batch export with progress indicator

**Files to modify**:

- `src/services/claude-api.ts` - Add methods to fetch full session data
- `src/services/export.ts` - New export service with format handlers
- `src/components/ExportDialog.vue` - New export configuration dialog
- `src/components/CommandPalette.vue` - Add export action

**API Considerations**:

- May need to fetch individual session conversations
- Implement rate limiting to avoid API throttling
- Consider chunked downloads for large exports

---

### Phase 3: Advanced Features

#### Recent Sessions List

**Priority**: High
**Complexity**: Low

Show recently accessed sessions for quick navigation.

**Implementation Details**:

- Track session access in local storage
- Show top 5-10 recent sessions when palette opens with empty query
- Clear recent history option
- Pin sessions to keep them in recent list

**Files to modify**:

- `src/services/storage.ts` - Add recent sessions tracking
- `src/composables/useRecent.ts` - New composable for recent sessions
- `src/components/CommandPalette.vue` - Add recent sessions section

---

#### Session Statistics Dashboard

**Priority**: Low
**Complexity**: High

Display usage statistics and insights about Claude Code sessions.

**Implementation Details**:

- Total sessions count
- Sessions per repository
- Activity timeline/heatmap
- Most active repositories
- Session duration estimates

**Files to modify**:

- `src/services/analytics.ts` - New analytics computation service
- `src/components/StatsDashboard.vue` - New dashboard component
- `src/components/CommandPalette.vue` - Add stats mode toggle

---

#### Global Search Across Conversations

**Priority**: Medium
**Complexity**: Very High

Search within conversation content, not just titles and repos.

**Implementation Details**:

- Index conversation content locally
- Full-text search with highlighting
- Search result previews with context
- Performance optimization for large histories

**Technical Considerations**:

- May require background indexing
- Consider using Web Workers for search
- Implement incremental indexing
- Storage quota management

---

#### Keyboard Shortcut Customization

**Priority**: Low
**Complexity**: Medium

Allow users to customize keyboard shortcuts.

**Implementation Details**:

- Settings page for shortcut configuration
- Conflict detection with existing Claude shortcuts
- Reset to defaults option
- Export/import shortcut configuration

**Files to modify**:

- `src/services/settings.ts` - New settings management service
- `src/components/SettingsPage.vue` - New settings page component
- `public/manifest.json` - Update to support configurable commands
- Background script updates for dynamic shortcut handling

---

## Technical Debt & Improvements

### Performance Optimization

- [ ] Implement virtual scrolling for large result sets
- [ ] Add request caching with service worker
- [ ] Lazy load components
- [ ] Optimize bundle size with dynamic imports

### Testing

- [ ] Add unit tests with Vitest
- [ ] Add E2E tests with Playwright
- [ ] Set up CI/CD pipeline
- [ ] Add visual regression tests

### Accessibility

- [ ] ARIA labels and roles
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Reduce motion option

### Documentation

- [ ] User guide with screenshots
- [ ] Developer documentation
- [ ] Contributing guidelines
- [ ] API documentation

---

## Contributing

We welcome contributions! To work on a feature:

1. Check if the feature is already in progress (look for linked PRs)
2. Comment on the relevant issue or create one
3. Fork the repository
4. Create a feature branch
5. Implement the feature following the implementation details above
6. Submit a PR with tests and documentation

### Development Setup

```bash
# Install dependencies
bun install

# Development build with watch
bun run dev

# Production build
bun run build

# Run linter
bun run lint
```

### Code Style

- Use TypeScript strictly
- Follow Vue 3 Composition API patterns
- Keep components small and focused
- Write meaningful commit messages
- Add JSDoc comments for public APIs

---

## Version History

### v1.0.0 (Current)

- Initial release
- Session search by title and repository
- Keyboard navigation
- Dark mode support

---

## Feedback

Have a feature request or found a bug? Please open an issue on GitHub.
