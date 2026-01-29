<template>
  <div class="w-full max-w-[400px] px-4 mx-auto">
    <div class="text-center mb-8">
      <h1
        class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
      >
        Reset Password
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Reset your account password
      </p>
    </div>

    <div class="auth-card p-6 md:p-8">
      <div
        v-if="status.message"
        :class="[
          'mb-5 border-l-4 p-3 rounded-r-lg animate-fade-in',
          status.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200',
        ]"
      >
        <p class="text-xs font-medium">{{ status.message }}</p>
      </div>

      <form @submit.prevent="handleReset" class="space-y-5">
        <PasswordInput v-model="form.password" label="New Password" required>
        </PasswordInput>

        <PasswordInput
          v-model="form.password_confirmation"
          label="Confirm Password"
          required
        >
        </PasswordInput>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white"
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
          <span>{{ loading ? "Updating..." : "Update Password" }}</span>
        </button>
      </form>

      <div
        class="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-700"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Changed your mind?
          <NuxtLink
            to="/login"
            class="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
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

const route = useRoute();
const router = useRouter();
const loading = ref(false);

const status = ref({
  type: "",
  message: "",
});

const form = ref({
  token: route.query.token,
  email: route.query.email,
  password: "",
  password_confirmation: "",
});

async function handleReset() {
  loading.value = true;
  status.value = { type: "", message: "" };

  try {
    const response = await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: form.value,
    });

    status.value = {
      type: "success",
      message: response.message || "Password updated! Redirecting to login...",
    };

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  } catch (err) {
    status.value = {
      type: "error",
      message:
        err.data?.data?.message || "Invalid or expired link. Please try again.",
    };
  } finally {
    loading.value = false;
  }
}
</script>
