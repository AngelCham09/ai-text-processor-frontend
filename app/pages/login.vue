<template>
  <div class="w-full max-w-[400px] px-4 mx-auto">
    <div class="text-center mb-8">
      <h1
        class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
      >
        Welcome Back
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Log in to access your AI tools
      </p>
    </div>

    <div class="auth-card p-6 md:p-8">
      <form @submit.prevent="loginUser" class="space-y-5">
        <div class="space-y-2">
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
          >
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

        <PasswordInput v-model="password" label="Password" required>
          <template #right-label>
            <NuxtLink
              to="/forgot-password"
              class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </NuxtLink>
          </template>
        </PasswordInput>

        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-r-lg animate-fade-in"
        >
          <p class="text-xs font-medium text-red-800 dark:text-red-200">
            {{ error }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ loading ? "Signing in..." : "Sign In" }}</span>
        </button>
      </form>

      <div
        class="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-700"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Sign Up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMyAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});

const router = useRouter();
const { setUser, setToken } = useMyAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function loginUser() {
  loading.value = true;
  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    setUser(res.data.user);
    setToken(res.data.token);

    router.push("/");
  } catch (err) {
    error.value = err.data?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
input:focus {
  outline: none;
}
</style>
