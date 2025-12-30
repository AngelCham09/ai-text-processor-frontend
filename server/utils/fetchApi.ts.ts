export async function fetchApi<T>(url: string, options: any = {}): Promise<T> {
  try {
    return await $fetch<T>(url, options);
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || "Internal Server Error",
      data: error.data,
    });
  }
}
