/**
 * Calculates the separation time in minutes.
 */
export const calculateMinutes = (milliseconds?: number): number => {
  if (!milliseconds) return 0;
  return Math.round(milliseconds / 60000);
};
