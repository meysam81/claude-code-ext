<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { useDarkMode } from '@/composables/useDarkMode'
import SearchResult from './SearchResult.vue'

const isOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const { isDark } = useDarkMode()

const {
  query,
  results,
  isLoading,
  error,
  selectedIndex,
  hasResults,
  hasQuery,
  selectNext,
  selectPrevious,
  selectResult,
  confirmSelection,
  reset,
  prefetchSessions,
} = useSearch()

function open() {
  isOpen.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
  // Prefetch sessions when opening
  prefetchSessions()
}

function close() {
  isOpen.value = false
  reset()
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      close()
      break
    case 'ArrowDown':
      event.preventDefault()
      selectNext()
      break
    case 'ArrowUp':
      event.preventDefault()
      selectPrevious()
      break
    case 'Enter':
      event.preventDefault()
      confirmSelection()
      close()
      break
  }
}

function handleGlobalKeydown(event: KeyboardEvent) {
  // Cmd/Ctrl + K to toggle
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    event.stopPropagation()
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    close()
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

// Expose open method for external access
defineExpose({ open, close })

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown, true)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown, true)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="cc-backdrop"
        :class="{ dark: isDark }"
        @click="handleBackdropClick"
        @keydown="handleKeydown"
      >
        <div class="cc-palette">
          <!-- Search Input -->
          <div class="cc-input-wrapper">
            <span class="cc-search-icon i-lucide-search" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="cc-input"
              placeholder="Search sessions by title or repo..."
              autocomplete="off"
              spellcheck="false"
            />
            <div class="cc-shortcuts">
              <kbd class="cc-kbd">esc</kbd>
            </div>
          </div>

          <!-- Divider -->
          <div class="cc-divider" />

          <!-- Results -->
          <div class="cc-results">
            <!-- Loading State -->
            <div v-if="isLoading" class="cc-state">
              <span class="cc-spinner" />
              <span>Searching...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="cc-state cc-error">
              <span>{{ error }}</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="hasQuery && !hasResults" class="cc-state">
              <span>No sessions found</span>
            </div>

            <!-- Initial State -->
            <div v-else-if="!hasQuery" class="cc-state cc-hint">
              <span>Type to search your Claude Code sessions</span>
            </div>

            <!-- Results List -->
            <template v-else>
              <SearchResult
                v-for="(result, index) in results"
                :key="result.session.uuid"
                :result="result"
                :is-selected="index === selectedIndex"
                :format-date="formatDate"
                @select="selectResult(index)"
                @confirm="confirmSelection(); close()"
              />
            </template>
          </div>

          <!-- Footer -->
          <div class="cc-footer">
            <div class="cc-footer-item">
              <kbd class="cc-kbd">↑</kbd>
              <kbd class="cc-kbd">↓</kbd>
              <span>Navigate</span>
            </div>
            <div class="cc-footer-item">
              <kbd class="cc-kbd">↵</kbd>
              <span>Open</span>
            </div>
            <div class="cc-footer-item">
              <kbd class="cc-kbd">esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
/* Scoped styles for the command palette */
.cc-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.cc-palette {
  width: 100%;
  max-width: 600px;
  margin: 0 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.dark .cc-palette {
  background: #1a1a1a;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.cc-input-wrapper {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.cc-search-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  flex-shrink: 0;
}

.cc-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #1a1a1a;
  outline: none;
}

.dark .cc-input {
  color: #f5f5f5;
}

.cc-input::placeholder {
  color: #9ca3af;
}

.cc-shortcuts {
  display: flex;
  gap: 4px;
}

.cc-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: #6b7280;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.dark .cc-kbd {
  color: #9ca3af;
  background: #2a2a2a;
  border-color: #404040;
}

.cc-divider {
  height: 1px;
  background: #e5e7eb;
}

.dark .cc-divider {
  background: #333333;
}

.cc-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.cc-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: #6b7280;
  font-size: 14px;
}

.dark .cc-state {
  color: #9ca3af;
}

.cc-hint {
  color: #9ca3af;
}

.cc-error {
  color: #ef4444;
}

.cc-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #d97757;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.cc-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.dark .cc-footer {
  border-top-color: #333333;
  background: #141414;
}

.cc-footer-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.dark .cc-footer-item {
  color: #9ca3af;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .cc-palette,
.fade-leave-active .cc-palette {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.fade-enter-from .cc-palette,
.fade-leave-to .cc-palette {
  opacity: 0;
  transform: scale(0.95);
}
</style>
