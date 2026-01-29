<template>
  <div class="space-y-2">
    <div v-if="variant === 'auth'" class="flex justify-between items-center">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {{ label }}
      </label>
      <slot name="right-label"></slot>
    </div>

    <label 
      v-else 
      class="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1 block"
    >
      {{ label }}
    </label>

    <div class="relative group">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="isPasswordVisible ? 'text' : 'password'"
        :placeholder="placeholder"
        :required="required"
        class="w-full transition-all duration-200 pr-12 outline-none"
        :class="inputClasses"
      />
      
      <button 
        type="button"
        @click="isPasswordVisible = !isPasswordVisible"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none cursor-pointer"
      >
        <i :class="['pi', isPasswordVisible ? 'pi-eye-slash' : 'pi-eye']" style="font-size: 1rem"></i>
      </button>
    </div>

    <p v-if="error" class="text-xs font-medium text-red-500 mt-1 ml-1 animate-fade-in">
      {{ error[0] }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  label: { type: String, default: 'Password' },
  placeholder: { type: String, default: '••••••••' },
  required: { type: Boolean, default: false },
  error: { type: Array, default: null },
  // variant can be 'auth' or 'profile'
  variant: { type: String, default: 'auth' }
});

defineEmits(['update:modelValue']);

const isPasswordVisible = ref(false);

const inputClasses = computed(() => {
  if (props.variant === 'profile') {
    // Exactly matches your Display Name input style
    return 'px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all';
  }
  // Standard Login/Register style
  return 'px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white';
});
</script>