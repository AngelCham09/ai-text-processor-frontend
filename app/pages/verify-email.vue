<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div
      class="max-w-md w-full text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
    >
      <div v-if="status === 'loading'" class="space-y-4">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Verifying your email...
        </h2>
        <p class="text-gray-500">Please wait while we confirm your account.</p>
      </div>

      <div v-if="status === 'success'" class="space-y-4">
        <div
          class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto"
        >
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Email Verified!
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Your account is now fully active! Your AI toolkit is unlocked and ready to help you craft perfect emails, essays, and more. Let's start writing.
        </p>
        <button @click="router.push('/')" class="btn-primary w-full">
          Go to Dashboard
        </button>
      </div>

      <div v-if="status === 'error'" class="space-y-4">
        <div
          class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto"
        >
          <svg
            class="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Verification Failed
        </h2>
        <p class="text-gray-600 dark:text-gray-400">{{ errorMessage }}</p>
        <button
          @click="router.push('/login')"
          class="text-blue-600 font-medium hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const auth = useMyAuthStore();

definePageMeta({
  layout: "auth",
});

const { data, error, status } = await useFetch("/api/auth/verify", {
  query: route.query,
});

watch(data, (newData) => {
  if (newData && auth.user) {
    auth.setUser({ ...auth.user, is_verified: true });
  }
});

const errorMessage = computed(() => {
  if (!error.value) return "";
  return error.value.data?.message || "The verification link is invalid or has expired.";
});
</script>
