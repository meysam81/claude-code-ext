/**
 * Composable for session search functionality
 */

import { ref, computed, watch } from "vue";
import { claudeApi } from "@/services/claude-api";
import type { SearchResult } from "@/types/api";

export function useSearch() {
  const query = ref("");
  const results = ref<SearchResult[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const selectedIndex = ref(0);

  // Debounce timeout
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  const hasResults = computed(() => results.value.length > 0);
  const hasQuery = computed(() => query.value.trim().length > 0);

  const selectedResult = computed(() => {
    if (
      selectedIndex.value >= 0 &&
      selectedIndex.value < results.value.length
    ) {
      return results.value[selectedIndex.value];
    }
    return null;
  });

  async function search(searchQuery: string) {
    if (!searchQuery.trim()) {
      results.value = [];
      selectedIndex.value = 0;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      results.value = await claudeApi.searchSessions(searchQuery);
      selectedIndex.value = 0;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Search failed";
      results.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // Debounced search on query change
  watch(query, (newQuery) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      search(newQuery);
    }, 150); // 150ms debounce
  });

  function selectNext() {
    if (results.value.length === 0) return;
    selectedIndex.value = (selectedIndex.value + 1) % results.value.length;
  }

  function selectPrevious() {
    if (results.value.length === 0) return;
    selectedIndex.value =
      selectedIndex.value <= 0
        ? results.value.length - 1
        : selectedIndex.value - 1;
  }

  function selectResult(index: number) {
    if (index >= 0 && index < results.value.length) {
      selectedIndex.value = index;
    }
  }

  function confirmSelection(): boolean {
    const selected = selectedResult.value;
    if (selected?.session?.uuid) {
      claudeApi.navigateToSession(selected.session.uuid);
      return true;
    }
    return false;
  }

  function reset() {
    query.value = "";
    results.value = [];
    selectedIndex.value = 0;
    error.value = null;
  }

  async function prefetchSessions() {
    try {
      await claudeApi.getSessions();
    } catch (err) {
      // Silently fail prefetch, but log error for debugging
      console.error("Prefetch sessions failed:", err);
    }
  }

  return {
    query,
    results,
    isLoading,
    error,
    selectedIndex,
    hasResults,
    hasQuery,
    selectedResult,
    search,
    selectNext,
    selectPrevious,
    selectResult,
    confirmSelection,
    reset,
    prefetchSessions,
  };
}
