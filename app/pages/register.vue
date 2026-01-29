<template>
  <div class="w-full max-w-[450px] px-4 mx-auto py-10">
    <div class="text-center mb-8">
      <h1
        class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
      >
        Create Account
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Join the AI Text Processor community
      </p>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8"
    >
      <form @submit.prevent="registerUser" class="space-y-5">
        <div class="space-y-2">
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1"
          >
            Full Name
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="John Doe"
            :class="['form-input', { 'form-input-error': fieldErrors.name }]"
            required
          />
          <p
            v-if="fieldErrors.name"
            class="text-xs font-medium text-red-500 mt-1 ml-1"
          >
            {{ fieldErrors.name[0] }}
          </p>
        </div>

        <div class="space-y-2">
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1"
          >
            Email Address
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="name@example.com"
            :class="['form-input', { 'form-input-error': fieldErrors.email }]"
            required
          />
          <p
            v-if="fieldErrors.email"
            class="text-xs font-medium text-red-500 mt-1 ml-1"
          >
            {{ fieldErrors.email[0] }}
          </p>
        </div>

        <PasswordInput
          v-model="password"
          label="Password"
          placeholder="Min. 8 characters"
          :error="fieldErrors.password"
          required
        />

        <PasswordInput
          v-model="passwordConfirm"
          label="Password Confirmation"
          placeholder="Repeat your password"
          :error="fieldErrors.password_confirmation"
          required
        />

        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-r-lg animate-fade-in"
        >
          <p class="text-xs font-medium text-red-800 dark:text-red-200">
            {{ error }}
          </p>
        </div>

        <div class="flex items-start space-x-3 py-2">
          <input
            type="checkbox"
            id="terms"
            required
            class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            for="terms"
            class="text-xs text-gray-500 dark:text-gray-400 leading-normal"
          >
            I agree to the
            <a href="#" class="text-blue-600 underline">Terms of Service</a> and
            <a href="#" class="text-blue-600 underline">Privacy Policy</a>.
          </label>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary">
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 mr-2"
            viewBox="0 0 24 24"
          >
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
          <span>{{ loading ? "Processing..." : "Create My Account" }}</span>
        </button>
      </form>

      <div
        class="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-700"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Log In
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

definePageMeta({ layout: "auth" });

const router = useRouter();
const { setUser, setToken } = useMyAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const error = ref("");
const fieldErrors = ref({});
const loading = ref(false);

async function registerUser() {
  loading.value = true;
  try {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirm.value,
      },
    });

    setUser(res.data.user);
    setToken(res.data.token);

    router.push("/");
  } catch (err) {
    const data = err.data?.data;

    error.value = data?.message || "Something went wrong";

    if (data?.errors) {
      fieldErrors.value = data.errors;
    }
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
