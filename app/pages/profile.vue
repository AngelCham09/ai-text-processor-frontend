<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div
      class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div class="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

      <div class="px-8 pb-8">
        <div class="relative flex justify-between items-end -mt-12 mb-6">
          <div class="p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <div
              class="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl"
            >
              {{ authStore.user?.name?.charAt(0) || "U" }}
            </div>
          </div>
          <button
            @click="showEditDialog = true"
            class="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">
              {{ authStore.user?.name }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
          </div>

          <span
            v-if="authStore.user?.is_verified"
            class="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-tighter"
          >
            Verified
          </span>
        </div>

        <div
          v-if="!authStore.user?.is_verified"
          class="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl"
        >
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4">
              <div
                class="hidden sm:flex w-12 h-12 bg-amber-100 dark:bg-amber-800 rounded-xl items-center justify-center text-amber-600 dark:text-amber-400"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white">
                  Verify your email address
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Almost there! Confirm your email to complete your profile
                  setup.
                </p>
              </div>
            </div>
            <button
              @click="resendEmail"
              :disabled="resending"
              class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-amber-200 cursor-pointer"
            >
              {{ resending ? "Sending..." : "Resend Link" }}
            </button>
          </div>
          <p
            v-if="resendMessage"
            class="mt-3 text-xs font-semibold text-amber-700 dark:text-amber-400 animate-pulse"
          >
            {{ resendMessage }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div
            class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800"
          >
            <p
              class="text-xs font-bold text-blue-500 uppercase tracking-widest"
            >
              Account Type
            </p>
            <p class="text-lg font-bold mt-1 text-gray-900 dark:text-white">
              Free Plan
            </p>
          </div>
          <div
            class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800"
          >
            <p
              class="text-xs font-bold text-purple-500 uppercase tracking-widest"
            >
              Joined
            </p>
            <p class="text-lg font-bold mt-1 text-gray-900 dark:text-white">
              {{ authStore.user?.joined_at_label }}
            </p>
          </div>
          <div
            class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800"
          >
            <p
              class="text-xs font-bold text-green-500 uppercase tracking-widest"
            >
              Total Credits
            </p>
            <p class="text-lg font-bold mt-1 text-gray-900 dark:text-white">
              Unlimited
            </p>
          </div>
        </div>
      </div>
    </div>

    <ProfileEditDialog 
      :show="showEditDialog" 
      :initialName="authStore.user?.name"
      @close="showEditDialog = false"
      @updated="onProfileUpdated"
    />

  </div>
</template>

<script setup>
import { useMyAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: "auth",
});
const authStore = useMyAuthStore();
const showEditDialog = ref(false);
const resending = ref(false);
const resendMessage = ref("");
const toast = useToast();

const onProfileUpdated = (userData) => {
  authStore.setUser(userData);
  toast.add({
    severity: 'success',
    summary: 'Profile Updated',
    detail: 'Your information has been saved successfully.',
    life: 3000
  });
};

async function resendEmail() {
  resending.value = true;
  resendMessage.value = "";

  try {
    await $fetch("/api/auth/resend", { method: "POST" });
    resendMessage.value = "Success! Please check your inbox for the new link.";
  } catch (err) {
    resendMessage.value =
      err.data?.data?.message ||
      "Failed to resend. Please try again in 1 minute.";
  } finally {
    resending.value = false;
  }
}
</script>
