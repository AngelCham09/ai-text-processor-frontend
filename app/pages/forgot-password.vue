<template>
  <div class="w-full max-w-[400px] px-4 mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Reset Password
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Enter your email to receive a reset link
      </p>
    </div>

    <div class="auth-card p-6 md:p-8">
      <div v-if="error" class="mb-5 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-r-lg animate-fade-in">
        <p class="text-xs font-medium text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <div v-if="message" class="mb-5 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-3 rounded-r-lg animate-fade-in">
        <p class="text-xs font-medium text-green-800 dark:text-green-200">{{ message }}</p>
      </div>

      <form @submit.prevent="handleForgot" class="space-y-5">
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Email Address
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="name@example.com"
            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
             <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
             <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? "Sending Link..." : "Send Reset Link" }}</span>
        </button>
      </form>

      <div class="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Remember your password? 
          <NuxtLink to="/login" class="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Back to Sign In
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

const email = ref("");
const loading = ref(false);
const message = ref("");
const error = ref("");

async function handleForgot() {
  loading.value = true;
  error.value = "";
  message.value = "";

  try {
    await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
    });
    message.value = "Check your inbox! We've sent a reset link.";
  } catch (err) {
    error.value = err.data?.data?.message || "Something went wrong.";
  } finally {
    loading.value = false;
  }
}
</script>
