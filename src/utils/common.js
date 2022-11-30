export const getSubdomain = () => {
  const host = window?.location?.host; // eslint-disable-line

  const parts = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);

  return parts[0];
};
