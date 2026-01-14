import { fetchApi } from "~~/server/utils/fetchApi.ts.js";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();

  const { id, hash, signature, expires } = query;

  const response = await fetchApi(
    `${config.apiBaseUrl}/email/verify/${id}/${hash}`,
    {
      method: "GET",
      params: { signature, expires },
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response;
});
