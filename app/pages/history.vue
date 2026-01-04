<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-20">
    <div class="flex items-center justify-between">
      <div>
        <h1
          class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
        >
          Processing History
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Review and reuse your previous AI transformations.
        </p>
      </div>
      <button
        @click="clearHistory"
        class="text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors"
      >
        Clear All
      </button>
    </div>

    <div v-if="pending" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-40 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-3xl"
      ></div>
    </div>

    <div
      v-else-if="!historyResponse?.data?.length"
      class="py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700"
    >
      <div class="text-4xl mb-4">📜</div>
      <p class="text-gray-400 font-bold">No history found yet.</p>
      <NuxtLink to="/" class="text-blue-500 text-sm font-bold mt-2 inline-block"
        >Start processing text now →</NuxtLink
      >
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in historyResponse.data"
        :key="item.id"
        class="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <span
              class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              :class="getActionClass(item.action_type)"
            >
              {{ item.action_type }}
            </span>
            <span class="text-xs text-gray-400 font-medium">{{
              item.created_formatted
            }}</span>
          </div>

          <button
            @click="copyText(item.output_text)"
            class="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all group/btn"
          >
            <svg
              class="w-4 h-4 text-gray-400 group-hover/btn:text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
            <p class="text-[10px] font-bold text-gray-400 uppercase mb-2">
              Input
            </p>
            <p
              class="text-sm text-gray-600 dark:text-gray-400 italic transition-all"
              :class="{ 'line-clamp-3': !expandedItems.has(item.id) }"
            >
              "{{ item.input_text }}"
            </p>
          </div>
          <div
            class="bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-50 dark:border-blue-900/20"
          >
            <p class="text-[10px] font-bold text-blue-400 uppercase mb-2">
              Result
            </p>
            <p 
              class="text-sm text-gray-900 dark:text-gray-200 transition-all"
              :class="{ 'line-clamp-3': !expandedItems.has(item.id) }"
            >
              {{ item.output_text }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex justify-center">
          <button 
            @click="toggleExpand(item.id)"
            class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {{ expandedItems.has(item.id) ? 'Show Less' : 'Show More' }}
            <svg 
              class="w-3 h-3 transition-transform" 
              :class="{ 'rotate-180': expandedItems.has(item.id) }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
      >
        <p class="text-sm font-bold text-gray-500 dark:text-gray-400 px-2">
          Showing
          <span class="text-blue-600"
            >{{ historyResponse.meta.from }}-{{ historyResponse.meta.to }}</span
          >
          of
          <span class="text-gray-900 dark:text-white">{{
            historyResponse.meta.total
          }}</span>
          results
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
  </div>
</template>

<script setup>
import { ref } from "vue";
const currentPage = ref(1);
const toast = useToast();
const expandedItems = ref(new Set());

const toggleExpand = (id) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};
const {
  data: historyResponse,
  pending,
  refresh,
} = await useAsyncData(
  "history",
  () =>
    $fetch("/api/auth/history", {
      params: { page: currentPage.value },
    }),
  {
    watch: [currentPage], 
    server: false,
  }
);

const onPageChange = (event) => {
  currentPage.value = event.page + 1;

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getActionClass = (action) => {
  const classes = {
    improve: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    summarize:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    professional:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    bullet:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return classes[action] || "bg-gray-100 text-gray-700";
};

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      severity: "success",
      summary: "Copied",
      detail: "Copied Successfully!",
      life: 3000,
    });
  } catch (error) {
    console.error("Failed to copy:", error);
  }
}

const clearHistory = async () => {
  if (confirm("Delete all history records?")) {
    try {
      await $fetch("/api/auth/history/clear", { method: "DELETE" });
      refresh();
    } catch (e) {
      console.error("Failed to clear history");
    }
  }
};
</script>
<style scoped>
/* Reset PrimeVue Defaults */
.custom-pagination.p-paginator {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
}

/* Style the page buttons (Numbers) */
.custom-pagination .p-paginator-pages .p-paginator-page {
  min-width: 2.5rem !important;
  height: 2.5rem !important;
  margin: 0 0.25rem !important; /* This replaces mx-1 */
  border-radius: 0.75rem !important; /* This replaces rounded-xl */
  font-weight: 700 !important;
  font-size: 0.875rem !important;
  transition: all 0.2s ease;
  border: none !important;
  background: transparent;
  color: #4b5563; /* text-gray-600 */
}

/* Style the Active/Highlight page */
.custom-pagination .p-paginator-pages .p-paginator-page.p-highlight {
  background-color: #2563eb !important; /* blue-600 */
  color: #ffffff !important;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); /* shadow-blue-500/30 */
  transform: scale(1.1);
}
</style>
