export const formatDate = (dateString) => {
  const options = {
    hour: "numeric",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
