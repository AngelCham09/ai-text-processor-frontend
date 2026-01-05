export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useMyAuthStore();

  if (!auth.isLoggedIn) {
    return navigateTo("/login");
  }
});
