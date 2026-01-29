<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-20">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Processing History
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Review and reuse your previous AI transformations.
        </p>
      </div>

      <div v-if="historyResponse?.data?.length" class="flex items-center gap-4">
        <div class="flex items-center gap-2 mr-2">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span class="text-xs font-bold text-gray-500 uppercase">Select All</span>
        </div>

        <button
          @click="clearHistory"
          class="text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>
    </div>

    <div v-if="isRefreshing" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-44 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-3xl"
      ></div>
    </div>

    <div v-else-if="historyResponse?.data?.length > 0" class="space-y-4">
      <div
        v-for="item in historyResponse.data"
        :key="item.id"
        class="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              :value="item.id"
              v-model="selectedIds"
              class="w-5 h-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span
              class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              :class="getActionClass(item.action_type)"
            >
              {{ item.action_type }}
            </span>
            <span class="text-xs text-gray-400 font-medium">
              {{ item.created_formatted }}
            </span>
          </div>

          <button
            @click="copyText(item.output_text)"
            class="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all group/btn"
          >
            <svg class="w-4 h-4 text-gray-400 group-hover/btn:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
            <p class="text-[10px] font-bold text-gray-400 uppercase mb-2">Input</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 italic transition-all" :class="{ 'line-clamp-3': !expandedItems.has(item.id) }">
              "{{ item.input_text }}"
            </p>
          </div>
          <div class="bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-50 dark:border-blue-900/20">
            <p class="text-[10px] font-bold text-blue-400 uppercase mb-2">Result</p>
            <p class="text-sm text-gray-900 dark:text-gray-200 transition-all" :class="{ 'line-clamp-3': !expandedItems.has(item.id) }">
              {{ item.output_text }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex justify-center">
          <button @click="toggleExpand(item.id)" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer">
            {{ expandedItems.has(item.id) ? "Show Less" : "Show More" }}
            <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': expandedItems.has(item.id) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <p class="text-sm font-bold text-gray-500 dark:text-gray-400 px-2">
          Showing <span class="text-blue-600">{{ historyResponse.meta.from }}-{{ historyResponse.meta.to }}</span>
          of <span class="text-gray-900 dark:text-white">{{ historyResponse.meta.total }}</span> results
        </p>

        <Paginator
          :rows="historyResponse.meta.per_page"
          :totalRecords="historyResponse.meta.total"
          :first="(currentPage - 1) * historyResponse.meta.per_page"
          @page="onPageChange"
          template="PrevPageLink PageLinks NextPageLink"
          class="custom-pagination"
        />
      </div>
    </div>

    <div v-else-if="isMounted && !pending && historyResponse?.data?.length === 0" class="py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
      <div class="text-4xl mb-4">📜</div>
      <p class="text-gray-400 font-bold">No history found yet.</p>
      <NuxtLink to="/" class="text-blue-500 text-sm font-bold mt-2 inline-block">
        Start processing text now →
      </NuxtLink>
    </div>

    <Transition name="slide-up">
      <div v-if="selectedIds.length > 0 && !isRefreshing" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          @click="deleteSelected"
          class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 hover:scale-105 transition-all border border-gray-700 dark:border-gray-200 cursor-pointer"
        >
          <span class="text-sm font-black uppercase tracking-tight">
            Delete {{ selectedIds.length }} Selected
          </span>
          <div class="h-4 w-[1px] bg-gray-700 dark:bg-gray-300"></div>
          <span class="text-[10px] font-black text-red-500 uppercase tracking-widest">Confirm</span>
        </button>
      </div>
    </Transition>
  </div>

  <HistoryDeleteModal
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :message="dialogConfig.message"
    :type="dialogConfig.type"
    :confirmText="dialogConfig.confirmText"
    @confirm="handleDialogConfirm"
    @cancel="dialogConfig.show = false"
  />
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  middleware: "auth",
});

const currentPage = ref(1);
const toast = useToast();
const expandedItems = ref(new Set());
const selectedIds = ref([]);
const isActionLoading = ref(false); // Manual loading trigger
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

// The refined Refresh Guard
const isRefreshing = computed(() => {
  // If not mounted yet, we MUST show skeleton (prevents flash)
  if (!isMounted.value) return true;
  
  // If mounted, follow the standard loading logic
  return pending.value || isActionLoading.value || historyResponse.value === null;
});

// Data Fetching
const { data: historyResponse, pending, refresh } = await useAsyncData(
  "history",
  () => $fetch("/api/auth/history", { query: { page: currentPage.value } }),
  { watch: [currentPage], server: false }
);

const isAllSelected = computed(() => {
  if (!historyResponse.value?.data?.length) return false;
  return historyResponse.value.data.every((item) => selectedIds.value.includes(item.id));
});

const toggleSelectAll = () => {
  const currentIds = historyResponse.value.data.map((item) => item.id);
  if (isAllSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !currentIds.includes(id));
  } else {
    selectedIds.value = [...new Set([...selectedIds.value, ...currentIds])];
  }
};

const toggleExpand = (id) => {
  expandedItems.value.has(id) ? expandedItems.value.delete(id) : expandedItems.value.add(id);
};

const dialogConfig = ref({
  show: false,
  title: '',
  message: '',
  type: 'primary',
  confirmText: '',
  action: null
});

const deleteSelected = () => {
  dialogConfig.value = {
    show: true,
    title: 'Delete Selected',
    message: `Are you sure you want to delete ${selectedIds.value.length} items? This will delete your data.`,
    type: 'danger',
    confirmText: 'Delete Items',
    action: 'delete'
  };
};

const clearHistory = () => {
  dialogConfig.value = {
    show: true,
    title: 'Clear All History',
    message: 'This will delete every single record in your history permanently. Do you want to proceed?',
    type: 'danger',
    confirmText: 'Clear Everything',
    action: 'clear'
  };
};

const handleDialogConfirm = async () => {
  const mode = dialogConfig.value.action;
  dialogConfig.value.show = false;
  isActionLoading.value = true; // Start loading

  try {
    if (mode === 'delete') {
      await $fetch("/api/auth/history", { method: "DELETE", body: { ids: selectedIds.value } });
      selectedIds.value = [];
    } else {
      await $fetch("/api/auth/history", { method: "DELETE" });
    }
    
    await refresh(); // Await the refresh so isRefreshing stays true until done
    toast.add({ severity: 'success', summary: 'Success', detail: 'History Updated', life: 3000 });
  } catch (e) {
    console.error("Action failed", e);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Action failed.', life: 4000 });
  } finally {
    isActionLoading.value = false; // Stop loading
  }
};

const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getActionClass = (action) => {
  const classes = {
    improve: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    summarize: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    professional: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    bullet: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return classes[action] || "bg-gray-100 text-gray-700";
};

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ severity: "success", summary: "Copied", detail: "Copied Successfully!", life: 3000 });
  } catch (error) {
    console.error("Failed to copy:", error);
  }
}
</script>

<style scoped>
/* Keep your existing styles here - including the Paginator circles we built */
:deep(.p-paginator) { background: transparent !important; border: none !important; padding: 1.5rem 0 !important; gap: 0.5rem; }
:deep(.p-paginator .p-link) { min-width: 2.75rem !important; height: 2.75rem !important; border-radius: 9999px !important; background: transparent !important; border: 1px solid transparent !important; font-weight: 600 !important; font-size: 0.875rem !important; color: #6b7280 !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; display: flex !important; align-items: center !important; justify-content: center !important; }
:deep(.dark) .p-paginator .p-link:not(.p-highlight) { color: #9ca3af !important; }
:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) { background-color: #2563eb !important; color: #ffffff !important; border-color: #3b82f6 !important; box-shadow: 0 0 15px -3px rgba(37, 99, 235, 0.5) !important; transform: scale(1.1); z-index: 10; }
:deep(.p-paginator .p-link:not(.p-highlight):hover) { background-color: rgba(37, 99, 235, 0.1) !important; border-color: rgba(37, 99, 235, 0.2) !important; color: #2563eb !important; }
:deep(.p-paginator .p-paginator-prev), :deep(.p-paginator .p-paginator-next) { background: rgba(156, 163, 175, 0.05) !important; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 100px) scale(0.8); }
</style>