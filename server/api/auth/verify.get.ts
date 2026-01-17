import { fetchApi } from "~~/server/utils/fetchApi.ts.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const { id, hash, signature, expires } = query;

  const cleanQuery = {
    signature,
    expires,
  };

  const backendUrl = `${config.apiBaseUrl}/email/verify/${id}/${hash}`;

  const response = await fetchApi(backendUrl, {
    method: "GET",
    params: cleanQuery,
    headers: {
      Accept: "application/json",
    },
  });

  return response;
});
