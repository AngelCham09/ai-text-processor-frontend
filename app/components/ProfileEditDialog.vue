<template>
  <Transition name="dialog">
    <div
      v-if="show"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        @click="$emit('close')"
      ></div>

      <div
        class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        <div class="px-8 pt-8 pb-4">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <p class="text-sm text-gray-500">
            Update your public identity and security.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 pt-4 space-y-6">
          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1"
              >Display Name</label
            >
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
              class="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-1"
              >Update Password (Optional)</label
            >

            <Transition name="slide">
              <div v-if="form.password.length > 0" class="space-y-2 mb-4">
                <AuthPasswordInput
                  v-if="form.password.length > 0"
                  v-model="form.current_password"
                  label="Verify Current Password"
                  placeholder="Enter old password"
                  :error="errors.current_password"
                />
              </div>
            </Transition>

            <AuthPasswordInput
              v-model="form.password"
              label="New Password"
              :error="errors.password"
            />

            <AuthPasswordInput
              v-model="form.password_confirmation"
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
              class="flex-1 px-4 py-4 rounded-2xl text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 cursor-pointer"
            >
              {{ loading ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
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

watch(
  () => form,
  () => {
    errors.value = {};
  },
  { deep: true },
);

watch(
  () => props.show,
  (val) => {
    if (val) form.name = props.initialName;
    form.password = "";
    form.password_confirmation = "";
  },
);

const handleSubmit = async () => {
  loading.value = true;
  errors.value = {};

  const payload = {
    name: form.name
  };

  if (form.password) {
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
      alert(e.message || "An unexpected error occurred");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
