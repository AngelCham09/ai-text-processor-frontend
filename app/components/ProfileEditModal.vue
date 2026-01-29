<template>
  <BaseModal :isOpen="show" @close="$emit('close')">
    <div class="text-left mb-6">
      <h2 class="text-2xl font-black text-gray-900 dark:text-white">
        Edit Profile
      </h2>
      <p class="text-sm text-gray-500">
        Update your public identity and security.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6 text-left">
      <div class="space-y-2">
        <label
          class="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1"
        >
          Display Name
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none"
          placeholder="Full Name"
        />
      </div>

      <div class="h-[1px] bg-gray-100 dark:bg-gray-800"></div>

      <div class="space-y-4">
        <label
          class="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-1 block mb-4"
        >
          Update Password (Optional)
        </label>

        <PasswordInput
          v-model="form.current_password"
          variant="profile"
          labelColor="text-purple-500"
          label="Verify Current Password"
          placeholder="Enter old password"
          :error="errors.current_password"
        />

        <PasswordInput
          v-model="form.password"
          variant="profile"
          label="New Password"
          :error="errors.password"
        />

        <PasswordInput
          v-model="form.password_confirmation"
          variant="profile"
          label="Confirm New Password"
          :error="errors.password_confirmation"
        />
      </div>

      <div class="flex gap-3 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 px-4 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 px-4 py-4 rounded-2xl text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
          {{ loading ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  initialName: String,
});
const emit = defineEmits(["close", "updated"]);

const loading = ref(false);
const form = reactive({
  name: props.initialName,
  current_password: "",
  password: "",
  password_confirmation: "",
});
const errors = ref({});

// Reset errors when user types
watch(
  () => form,
  () => {
    errors.value = {};
  },
  { deep: true },
);

// Reset form fields when modal opens/closes
watch(
  () => props.show,
  (val) => {
    if (val) {
      form.name = props.initialName;
      form.current_password = "";
      form.password = "";
      form.password_confirmation = "";
      errors.value = {};
    }
  },
);

const handleSubmit = async () => {
  loading.value = true;
  errors.value = {};

  const payload = { name: form.name };

  if (form.password || form.password_confirmation || form.current_password) {
    payload.password = form.password;
    payload.password_confirmation = form.password_confirmation;
    payload.current_password = form.current_password;
  }

  try {
    const res = await $fetch("/api/auth/profile", {
      method: "PUT",
      body: payload,
    });
    emit("updated", res.data.user);
    emit("close");
  } catch (e) {
    const errorData = e.response?._data?.data || e.response?._data;
    if (errorData?.errors) {
      errors.value = errorData.errors;
    } else {
      console.error(e);
    }
  } finally {
    loading.value = false;
  }
};
</script>
