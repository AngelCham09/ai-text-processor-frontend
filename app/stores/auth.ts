import { defineStore } from "pinia";

export const useMyAuthStore = defineStore("auth", () => {
  const token = useCookie("auth_token", { maxAge: 7 * 24 * 3600 }); 
  const user = useState("auth_user", () => null);

  const isLoggedIn = computed(() => !!token.value);
  const isLoggingOut = ref(false);

  // Setters
  const setToken = (t: string | null) => {
    token.value = t;
  };

  const setUser = (u: any) => {
    user.value = u;
  };

  // Logout function
  const logout = async () => {
    if (isLoggingOut.value) return;
    isLoggingOut.value = true;

    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);git add
    } finally {
      token.value = null;
      user.value = null;
      isLoggingOut.value = false;
      navigateTo("/login");
    }
  };

  const loadProfile = async () => {
    if (token.value) {
      try {
        const res = await $fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        setUser(res.data.user ?? res);
      } catch (err) {
        console.error("Failed to load profile", err);
        setToken(null);
        setUser(null);
      }
    }
  };

  return { token, user, isLoggedIn, setToken, setUser, logout, loadProfile };
});
