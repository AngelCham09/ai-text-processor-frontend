import { fetchApi } from "~~/server/utils/fetchApi.ts.js";


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  const response = await fetchApi(`${config.apiBaseUrl}/login`, {
    method: "POST",
    body: body,
    headers: {
      Accept: "application/json",
    },
  });

  return response;
});
