import { fetchApi } from "~~/server/utils/fetchApi.ts.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const token = getCookie(event, "auth_token");

  const response = await fetchApi(`${config.apiBaseUrl}/logout`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
});
