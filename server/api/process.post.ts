import { fetchApi } from "../utils/fetchApi.ts";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  const token = getCookie(event, "auth_token");
  
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetchApi(`${config.apiBaseUrl}/process-text`, {
    method: "POST",
    body: body,
    headers
  });

  return response;
});
