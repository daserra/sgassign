export function sleepInMs(sleepTime: number) {
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
}
