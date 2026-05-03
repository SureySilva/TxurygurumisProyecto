import sanitizeHtml from "sanitize-html";

// Sanitización
export const sanitize = (text: string) =>
  sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });

export const sanitizeObjectStrings =
<T extends Record<string, unknown>>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === "string" ? sanitize(value) : value,
    ])
  ) as T;
};
