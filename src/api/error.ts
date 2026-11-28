// The API sends `{ message }` on errors, fall back when it doesn't.
export const errorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const { message } = await response.json();
    return message ?? fallback;
  } catch {
    return fallback;
  }
};
