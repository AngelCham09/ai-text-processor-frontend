<template>
  <div class="min-h-screen transition-colors duration-300">
    <header
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1
            class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Writing Assistant
          </h1>

          <div class="flex items-center space-x-4">
            <button
              @click="toggleTheme"
              class="group relative flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all active:scale-95"
            >
              <div class="relative w-5 h-5">
                <svg
                  v-if="colorMode.preference === 'system'"
                  class="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

                <svg
                  v-else-if="colorMode.preference === 'dark'"
                  class="w-5 h-5 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>

                <svg
                  v-else
                  class="w-5 h-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </button>

            <div v-if="!isLoggedIn" class="flex items-center space-x-2">
              <NuxtLink
                to="/login"
                class="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Log In
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95"
              >
                Get Started
              </NuxtLink>
            </div>

            <div
              v-else
              class="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700"
            >
              <div class="hidden sm:block text-right">
                <p class="text-xs font-black text-gray-900 dark:text-white">
                  {{ user?.name }}
                </p>
                <p
                  class="text-[10px] font-bold text-blue-500 uppercase tracking-widest"
                >
                  Free Account
                </p>
              </div>
              <button
                @click="logout"
                class="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <slot />
    </main>

  </div>
</template>

<script setup>
import { useMyAuthStore } from '~/stores/auth';
const colorMode = useColorMode();
const { isLoggedIn, user, logout } = useMyAuthStore();

const toggleTheme = () => {
  const modes = ["light", "dark", "system"];

  const currentIndex = modes.indexOf(colorMode.preference);

  colorMode.preference = modes[(currentIndex + 1) % modes.length];
};
</script>
