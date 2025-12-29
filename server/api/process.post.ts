export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. Grab the data sent from your Vue component
  const body = await readBody(event);

  try {
    // 2. Perform the actual call to your Python/Node/Laravel backend
    // Nuxt's $fetch handles the communication server-to-server
    const response = await $fetch(`${config.apiBaseUrl}/process-text`, {
      method: "POST",
      body: body,
      headers: {
        Accept: "application/json",
      },
    });

    // 3. Return the data back to the frontend
    return response;
  } catch (error: any) {
    // If the backend fails, pass that error back gracefully
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || "Internal Server Error",
      data: error.data,
    });
  }
});
