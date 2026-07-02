export const getFallbackAvatarUrl = (name = "User") => {
  const seed = encodeURIComponent(name || "User");
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
};

export const getRandomAvatarUrl = (seed) => {
  return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`;
};