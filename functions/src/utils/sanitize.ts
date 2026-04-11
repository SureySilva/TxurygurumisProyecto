import sanitizeHtml from "sanitize-html";

// Sanitización
export const sanitize = (text: string) =>
  sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
