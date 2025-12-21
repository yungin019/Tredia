// src/lib/apiErrors.ts
export type ApiError = {
  message: string;
  status?: number;
  isNetworkError: boolean;
  isRetryable: boolean;
};

/** Normalize errors from fetch, axios, or generic thrown values into ApiError */
export function normalizeApiError(err: any): ApiError {
  // Axios errors
  if (err?.isAxiosError) {
    // Response received (HTTP error)
    if (err.response) {
      const status: number = err.response.status;
      const message: string =
        err.response.data?.message || err.response.data?.error || err.message || `Request failed with status ${status}`;
      const isRetryable = status >= 500 || status === 429;
      return { message, status, isNetworkError: false, isRetryable };
    }

    // No response (network / timeout / CORS)
    if (err.request) {
      const message = err.message || "No response from server";
      const isNetworkError = true;
      const isRetryable = true;
      return { message, isNetworkError, isRetryable };
    }

    // Something happened setting up the request
    return {
      message: err.message || "Request error",
      isNetworkError: false,
      isRetryable: false,
    };
  }

  // Fetch aborted (timeout)
  if (err?.name === "AbortError") {
    return {
      message: "Request timed out",
      isNetworkError: false,
      isRetryable: true,
    };
  }

  // Fetch/network error often surfaces as TypeError
  if (err instanceof TypeError) {
    return {
      message: err.message || "Network error",
      isNetworkError: true,
      isRetryable: true,
    };
  }

  // Generic thrown value
  const message = err?.message || String(err) || "Unknown error";
  return { message, isNetworkError: false, isRetryable: false };
}

/** Helper to convert a non-ok fetch Response into an ApiError */
export function errorFromResponse(response: Response): ApiError {
  const status = response.status;
  const message = `Request failed with status ${status}`;
  const isRetryable = status >= 500 || status === 429;
  return { message, status, isNetworkError: false, isRetryable };
}
