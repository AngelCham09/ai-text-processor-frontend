<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      
      <div class="px-8 pb-8">
        <div class="relative flex justify-between items-end -mt-12 mb-6">
          <div class="p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <div class="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl">
              {{ user?.name?.charAt(0) || 'U' }}
            </div>
          </div>
          <button class="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            Edit Profile
          </button>
        </div>

        <div class="space-y-1">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">{{ user?.name }}</h1>
          <p class="text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800">
            <p class="text-xs font-bold text-blue-500 uppercase tracking-widest">Account Type</p>
            <p class="text-lg font-bold mt-1 text-gray-900 dark:text-white">Free Plan</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800">
            <p class="text-xs font-bold text-purple-500 uppercase tracking-widest">Joined</p>
            <p class="text-lg font-bold mt-1 text-gray-900 dark:text-white">{{ user?.joined_at_label }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800">
            <p class="text-xs font-bold text-green-500 uppercase tracking-widest">Total Credits</p>
            <p class="text-lg font-bold mt-1 text-gray-900 dark:text-white">Unlimited</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMyAuthStore } from '~/stores/auth';
const { user } = useMyAuthStore();
</script>