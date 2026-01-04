<template>
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
    <div class="text-center">
      <h1
        class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight"
      >
        AI Text Processor
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Transform, summarize, and format content instantly.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div class="space-y-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex justify-between items-center mb-3">
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
            >
              Input Text
            </label>

            <span
              :class="[
                'text-xs font-medium',
                isOverLimit ? 'text-red-500' : 'text-gray-500',
              ]"
            >
              {{ charCount }} / {{ MAX_CHARS }}
            </span>
          </div>

          <textarea
            v-model="text"
            rows="10"
            placeholder="Type or paste your text here..."
            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200 resize-none"
            :class="{ 'border-red-500 focus:ring-red-500/10': isOverLimit }"
          ></textarea>

          <div class="mt-4 flex justify-end">
            <button
              @click="clearText"
              class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Clear Text
            </button>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider"
          >
            Select Transformation
          </label>
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="option in actionOptions"
              :key="option.value"
              @click="action = option.value"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200 text-left group',
                action === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-4 ring-blue-500/10'
                  : 'border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800',
              ]"
            >
              <div
                class="text-2xl mb-2 group-hover:scale-110 transition-transform"
              >
                {{ option.icon }}
              </div>
              <div class="font-bold text-gray-900 dark:text-white">
                {{ option.label }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ option.description }}
              </div>
            </button>
          </div>
        </div>

        <button
          @click="processText"
          :disabled="!text.trim() || loading"
          class="btn-primary"
        >
          <svg
            v-if="loading"
            class="animate-spin w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ loading ? "Analyzing Text..." : "Generate Result" }}</span>
        </button>
      </div>

      <div class="space-y-6 sticky top-8">
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-xl p-4 animate-slide-in"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">
                {{ error }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col min-h-[500px]"
        >
          <div
            class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50"
          >
            <h2
              class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest"
            >
              Output
            </h2>
            <button
              v-if="result"
              @click="copyToClipboard"
              class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <svg
                class="w-4 h-4"
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
              <span>Copy Text</span>
            </button>
          </div>

          <div class="flex-1 p-6">
            <div v-if="loading" class="space-y-4 animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div
                class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
              ></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>

            <div
              v-else-if="!result"
              class="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 py-12"
            >
              <svg
                class="w-16 h-16 mb-4 opacity-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707m1.414 14.142l-.707-.707M12 18v1m4.707-3.293l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p class="text-lg">Ready to process...</p>
              <p class="text-sm">Configure the left side and click process.</p>
            </div>

            <div
              v-else
              class="prose dark:prose-invert max-w-none animate-fade-in"
            >
              <p
                class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
              >
                {{ result }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const MAX_CHARS = 5000;

const toast = useToast();
const text = ref("");
const action = ref("improve");
const result = ref("");
const error = ref("");
const loading = ref(false);

const charCount = computed(() => text.value.length);
const isOverLimit = computed(() => charCount.value > MAX_CHARS);

const clearText = () => {
  text.value = '';
};

const actionOptions = [
  {
    value: "improve",
    label: "Improve",
    icon: "✨",
    description: "Better flow & grammar",
  },
  {
    value: "summarize",
    label: "Summarize",
    icon: "📝",
    description: "Short & concise",
  },
  {
    value: "professional",
    label: "Professional",
    icon: "💼",
    description: "Formal business tone",
  },
  {
    value: "bullet",
    label: "Bullets",
    icon: "📋",
    description: "Key points format",
  },
];

async function processText() {
  loading.value = true;
  error.value = "";
  result.value = "";

  try {
    const response = await $fetch("/api/process", {
      method: "POST",
      body: {
        text: text.value,
        action: action.value,
      },
    });

    result.value = response.data?.result || response.result;
  } catch (err) {
    error.value =
      err.data?.data?.message || "Something went wrong. Please try again.";
    console.error("API Error:", err);
  } finally {
    loading.value = false;
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(result.value);
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
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
