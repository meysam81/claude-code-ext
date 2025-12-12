<script setup lang="ts">
import type { SearchResult } from "@/types/api";

interface Props {
  result: SearchResult;
  isSelected: boolean;
  formatDate: (date: string) => string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [];
  confirm: [];
}>();

function getTitle(): string {
  return props.result.session.title || "Untitled Session";
}
</script>

<template>
  <div
    class="cc-result"
    :class="{ 'cc-result-selected': isSelected }"
    @mouseenter="emit('select')"
    @click="emit('confirm')"
  >
    <div class="cc-result-icon">
      <span v-if="result.repoName" class="i-lucide-git-branch" />
      <span v-else class="i-lucide-message-square" />
    </div>

    <div class="cc-result-content">
      <div class="cc-result-title">
        {{ getTitle() }}
      </div>
      <div class="cc-result-meta">
        <span v-if="result.repoName" class="cc-result-repo">
          {{ result.repoName }}
        </span>
        <span class="cc-result-time">
          <span class="i-lucide-clock cc-clock-icon" />
          {{ formatDate(result.session.updated_at) }}
        </span>
      </div>
    </div>

    <div v-if="isSelected" class="cc-result-action">
      <kbd class="cc-kbd">↵</kbd>
    </div>
  </div>
</template>

<style>
.cc-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.cc-result:hover,
.cc-result-selected {
  background: #f3f4f6;
}

.dark .cc-result:hover,
.dark .cc-result-selected {
  background: #2a2a2a;
}

.cc-result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #6b7280;
  flex-shrink: 0;
}

.dark .cc-result-icon {
  background: #333333;
  color: #9ca3af;
}

.cc-result-icon span {
  width: 18px;
  height: 18px;
}

.cc-result-content {
  flex: 1;
  min-width: 0;
}

.cc-result-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .cc-result-title {
  color: #f5f5f5;
}

.cc-result-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
  font-size: 12px;
  color: #6b7280;
}

.dark .cc-result-meta {
  color: #9ca3af;
}

.cc-result-repo {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: rgba(217, 119, 87, 0.1);
  color: #d97757;
  border-radius: 4px;
  font-weight: 500;
}

.cc-result-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cc-clock-icon {
  width: 12px;
  height: 12px;
}

.cc-result-action {
  flex-shrink: 0;
}
</style>
