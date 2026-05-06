function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export function getOrCreateUserId(): string {
  const stored = localStorage.getItem("userId");
  if (stored) {
    return stored;
  }
  const newId = generateUserId();
  localStorage.setItem("userId", newId);
  return newId;
}
