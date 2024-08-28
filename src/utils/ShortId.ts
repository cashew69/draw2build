export function ShortId(): string {
  const timestamp = Date.now().toString(36).slice(-3); // Convert timestamp to base-36 and take last 3 characters
  const randomString = Math.random().toString(36).slice(2, 4); // Generate a random 2-character string
  return `${timestamp}-${randomString}`;
}
