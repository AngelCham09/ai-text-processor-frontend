<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="$emit('cancel')"></div>
      
      <Transition name="zoom">
        <div v-if="show" class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div class="flex flex-col items-center text-center">
            <div :class="[
              'p-4 rounded-3xl mb-4',
              type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
            ]">
              <svg v-if="type === 'danger'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              {{ message }}
            </p>

            <div class="flex gap-3 w-full">
              <button 
                @click="$emit('cancel')" 
                class="flex-1 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                @click="$emit('confirm')" 
                :class="[
                  'flex-1 px-4 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer',
                  type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                ]"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: { type: String, default: 'Confirm' },
  type: { type: String, default: 'primary' }
});
defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.zoom-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.zoom-leave-active { transition: all 0.2s ease-in; }
.zoom-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
.zoom-leave-to { opacity: 0; transform: scale(0.95); }
</style>