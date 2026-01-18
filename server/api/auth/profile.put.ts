import { fetchApi } from "~~/server/utils/fetchApi.ts.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const token = getCookie(event, "auth_token");
  const body = await readBody(event);

  const response = await fetchApi(`${config.apiBaseUrl}/profile/update`, {
    method: 'PUT',
    body: body,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
});
