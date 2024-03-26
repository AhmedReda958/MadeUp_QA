export const isOnline = (lastSeen) => {
  const now = Date.now();
  const diff = now - new Date(lastSeen).getTime();
  const online = diff < 60000 * 5; // 5 minutes
  return online;
};
