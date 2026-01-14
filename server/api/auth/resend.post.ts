import { fetchApi } from "~~/server/utils/fetchApi.ts.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);
  const token = getCookie(event, "auth_token");

  const response = await fetchApi(`${config.apiBaseUrl}/email/resend`, {
    method: "POST",
    body: body,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
});
