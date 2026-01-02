import { computed } from "vue";
import { useCookie } from "#app";

export function useAuth() {
  const token = useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 }); // 1 week

  const user = useState("auth_user", () => null);

  const setUser = (u: any) => (user.value = u);
  const setToken = (t: string | null) => (token.value = t);

  const fetchUser = async () => {
    if (!token.value || user.value) return;

    try {
      const res = await $fetch("/api/auth/profile");
      user.value = res.data.user ?? res;
    } catch (err) {
      token.value = null;
      user.value = null;
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Backend logout failed:", err);
    } finally {
      user.value = null;
      token.value = null;

      const authCookie = useCookie("auth_token");
      authCookie.value = null;
      navigateTo("/login");
    }
  };

  const isLoggedIn = computed(() => !!token.value);

  return {
    user,
    token,
    setUser,
    setToken,
    fetchUser,
    logout,
    isLoggedIn,
  };
}
