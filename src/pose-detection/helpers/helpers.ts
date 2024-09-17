export const asyncRequestAnimationFrameMs = (ms: number = 0) =>
  new Promise((resolve) =>
    setTimeout(() => window.requestAnimationFrame(resolve), ms)
  );

export const sleep = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));
