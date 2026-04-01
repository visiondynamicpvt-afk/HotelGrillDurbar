export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

type ResponseWithMessage = {
  message?: unknown;
};

export const parseJsonResponse = async <T = unknown>(response: Response): Promise<T | null> => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

export const getResponseMessage = (
  response: Response,
  result: unknown,
  fallback: string
): string => {
  if (result && typeof result === 'object' && 'message' in result) {
    const message = (result as ResponseWithMessage).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return response.statusText || fallback;
};

export const expectJsonResponse = <T>(
  result: T | null,
  fallback = 'Invalid response from server'
): T => {
  if (result === null) {
    throw new Error(fallback);
  }

  return result;
};
