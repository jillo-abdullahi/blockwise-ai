// Simple client-side rate limiter to prevent excessive API calls
class RateLimiter {
  private lastRequestTime: number = 0;
  private readonly minInterval: number;

  constructor(minIntervalMs: number = 5000) { // 5 seconds minimum between requests
    this.minInterval = minIntervalMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    return now - this.lastRequestTime >= this.minInterval;
  }

  getTimeUntilNextRequest(): number {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    return Math.max(0, this.minInterval - timeSinceLastRequest);
  }

  recordRequest(): void {
    this.lastRequestTime = Date.now();
  }
}

export const aiAnalysisLimiter = new RateLimiter(10000); // 10 seconds between AI analysis requests
