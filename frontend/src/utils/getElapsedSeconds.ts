export function getElapsedSeconds(lastEnteredInProgressAt: string, now: number = Date.now()): number {
  const startTime = new Date(lastEnteredInProgressAt).getTime();
  return Math.floor((now - startTime) / 1000);
}