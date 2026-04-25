interface ApiErrorShape {
  data?: {
    message?: string;
  };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const maybeError = error as ApiErrorShape;

  if (
    typeof maybeError === "object"
    && maybeError !== null
    && typeof maybeError.data?.message === "string"
  ) {
    return maybeError.data.message;
  }

  return fallback;
}
