export function getBackendBaseUrl() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : undefined);

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_BASE_URL is not configured.");
  }

  return baseUrl.replace(/\/+$/, "");
}


