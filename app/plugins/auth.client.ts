import { useMyAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useMyAuthStore();
  await auth.loadProfile();
});
